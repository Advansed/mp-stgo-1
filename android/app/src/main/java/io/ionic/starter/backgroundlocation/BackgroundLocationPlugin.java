package io.ionic.starter.backgroundlocation;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

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
  private static final String TAG = "BackgroundLocation";
  private static BackgroundLocationPlugin instance;

  private long intervalMs = 15_000L;
  private String title = "МП СТГО";
  private String message = "Отслеживание местоположения";

  @Override
  public void load() {
    instance = this;
    Log.i(TAG, "plugin load");
  }

  @Override
  protected void handleOnDestroy() {
    if (instance == this) {
      instance = null;
      Log.i(TAG, "plugin destroy, instance cleared");
    }
    super.handleOnDestroy();
  }

  static void emitLocation(double lat, double lon, Float speed, Float bearing) {
    BackgroundLocationPlugin plugin = instance;
    if (plugin == null) {
      Log.w(TAG, "plugin instance null, drop lat=" + lat + " lon=" + lon);
      return;
    }

    JSObject data = new JSObject();
    data.put("latitude", lat);
    data.put("longitude", lon);
    if (speed != null) {
      data.put("speed", speed.doubleValue());
    }
    if (bearing != null) {
      data.put("heading", bearing.doubleValue());
    }
    Log.i(TAG, "notifyListeners location lat=" + lat + " lon=" + lon);
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

    Log.i(TAG, "start intervalMs=" + intervalMs + " hasPerm=" + hasLocationPermission());

    if (!hasLocationPermission()) {
      Log.i(TAG, "requesting location permission");
      requestPermissionForAlias("location", call, "locationPermsCallback");
      return;
    }

    maybeRequestNotificationsThenStart(call);
  }

  @PermissionCallback
  private void locationPermsCallback(PluginCall call) {
    if (!hasLocationPermission()) {
      Log.w(TAG, "location permission denied");
      call.reject("Location permission denied", "NOT_AUTHORIZED");
      return;
    }
    maybeRequestNotificationsThenStart(call);
  }

  @PermissionCallback
  private void notificationPermsCallback(PluginCall call) {
    Log.i(TAG, "notification permission result granted=" + hasNotificationPermission());
    startServiceAndResolve(call);
  }

  private void maybeRequestNotificationsThenStart(PluginCall call) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && !hasNotificationPermission()) {
      Log.i(TAG, "requesting notification permission");
      requestPermissionForAlias("notifications", call, "notificationPermsCallback");
      return;
    }
    startServiceAndResolve(call);
  }

  private void startServiceAndResolve(PluginCall call) {
    try {
      Intent intent = new Intent(getContext(), LocationTrackingService.class);
      intent.setAction(LocationTrackingService.ACTION_START);
      intent.putExtra(LocationTrackingService.EXTRA_INTERVAL_MS, intervalMs);
      intent.putExtra(LocationTrackingService.EXTRA_TITLE, title);
      intent.putExtra(LocationTrackingService.EXTRA_MESSAGE, message);

      ContextCompat.startForegroundService(getContext(), intent);
      Log.i(TAG, "startForegroundService ok");
      call.resolve();
    } catch (Exception e) {
      Log.e(TAG, "startForegroundService failed", e);
      call.reject("Failed to start location service: " + e.getMessage(), "SERVICE_START_FAILED", e);
    }
  }

  @PluginMethod
  public void stop(PluginCall call) {
    Log.i(TAG, "stop");
    try {
      Intent intent = new Intent(getContext(), LocationTrackingService.class);
      intent.setAction(LocationTrackingService.ACTION_STOP);
      getContext().startService(intent);
      getContext().stopService(new Intent(getContext(), LocationTrackingService.class));
    } catch (Exception e) {
      Log.w(TAG, "stop failed", e);
    }
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
