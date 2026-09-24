package io.ionic.starter.backgroundlocation;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
  name = "BackgroundLocation",
  permissions = {
    @Permission(
      alias = "location",
      strings = {
        Manifest.permission.ACCESS_COARSE_LOCATION,
        Manifest.permission.ACCESS_FINE_LOCATION
      }
    ),
    @Permission(
      alias = "notifications",
      strings = { Manifest.permission.POST_NOTIFICATIONS }
    )
  }
)
public class BackgroundLocationPlugin extends Plugin {
  private static BackgroundLocationPlugin instance;

  private long intervalMs = 5 * 60 * 1000L;
  private String title = "МП СТГО";
  private String message = "Отслеживание местоположения";

  @Override
  public void load() {
    instance = this;
  }

  @Override
  protected void handleOnDestroy() {
    if (instance == this) {
      instance = null;
    }
    super.handleOnDestroy();
  }

  static void emitLocation(double lat, double lon, Float speed, Float bearing) {
    BackgroundLocationPlugin plugin = instance;
    if (plugin == null) return;

    JSObject data = new JSObject();
    data.put("latitude", lat);
    data.put("longitude", lon);
    if (speed != null) {
      data.put("speed", speed.doubleValue());
    }
    if (bearing != null) {
      data.put("heading", bearing.doubleValue());
    }
    plugin.notifyListeners("location", data);
  }

  @PluginMethod
  public void start(PluginCall call) {
    Long interval = call.getLong("intervalMs");
    if (interval != null && interval > 0) {
      intervalMs = interval;
    }
    String t = call.getString("title");
    String m = call.getString("message");
    if (t != null && !t.isEmpty()) title = t;
    if (m != null && !m.isEmpty()) message = m;

    if (!hasLocationPermission()) {
      requestPermissionForAlias("location", call, "locationPermsCallback");
      return;
    }

    maybeRequestNotificationsThenStart(call);
  }

  @PermissionCallback
  private void locationPermsCallback(PluginCall call) {
    if (!hasLocationPermission()) {
      call.reject("Location permission denied", "NOT_AUTHORIZED");
      return;
    }
    maybeRequestNotificationsThenStart(call);
  }

  @PermissionCallback
  private void notificationPermsCallback(PluginCall call) {
    // Notifications are recommended but not hard-required for FGS on all OEMs
    startServiceAndResolve(call);
  }

  private void maybeRequestNotificationsThenStart(PluginCall call) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && !hasNotificationPermission()) {
      requestPermissionForAlias("notifications", call, "notificationPermsCallback");
      return;
    }
    startServiceAndResolve(call);
  }

  private void startServiceAndResolve(PluginCall call) {
    Intent intent = new Intent(getContext(), LocationTrackingService.class);
    intent.setAction(LocationTrackingService.ACTION_START);
    intent.putExtra(LocationTrackingService.EXTRA_INTERVAL_MS, intervalMs);
    intent.putExtra(LocationTrackingService.EXTRA_TITLE, title);
    intent.putExtra(LocationTrackingService.EXTRA_MESSAGE, message);

    ContextCompat.startForegroundService(getContext(), intent);
    call.resolve();
  }

  @PluginMethod
  public void stop(PluginCall call) {
    Intent intent = new Intent(getContext(), LocationTrackingService.class);
    intent.setAction(LocationTrackingService.ACTION_STOP);
    getContext().startService(intent);
    getContext().stopService(new Intent(getContext(), LocationTrackingService.class));
    call.resolve();
  }

  private boolean hasLocationPermission() {
    return ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION)
        == PackageManager.PERMISSION_GRANTED
      || ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_COARSE_LOCATION)
        == PackageManager.PERMISSION_GRANTED;
  }

  private boolean hasNotificationPermission() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return true;
    return ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS)
      == PackageManager.PERMISSION_GRANTED;
  }
}
