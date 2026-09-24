package io.ionic.starter.backgroundlocation;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import io.ionic.starter.MainActivity;
import io.ionic.starter.R;

/**
 * Foreground service: keeps process alive while minimized and emits location ticks.
 * Does not auto-restart after force-stop / reboot (START_NOT_STICKY).
 */
public class LocationTrackingService extends Service {
  public static final String ACTION_START = "io.ionic.starter.backgroundlocation.START";
  public static final String ACTION_STOP = "io.ionic.starter.backgroundlocation.STOP";
  public static final String EXTRA_INTERVAL_MS = "intervalMs";
  public static final String EXTRA_TITLE = "title";
  public static final String EXTRA_MESSAGE = "message";

  private static final String CHANNEL_ID = "mp_stgo_location";
  private static final int NOTIFICATION_ID = 42001;
  private static final String TAG = "LocTrackingService";

  private final Handler handler = new Handler(Looper.getMainLooper());
  private LocationManager locationManager;
  private LocationListener locationListener;
  private long intervalMs = 5 * 60 * 1000L;
  private boolean running = false;

  private final Runnable tickRunnable = new Runnable() {
    @Override
    public void run() {
      if (!running) return;
      requestOneFix();
      handler.postDelayed(this, intervalMs);
    }
  };

  @Override
  public void onCreate() {
    super.onCreate();
    locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    ensureChannel();
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    if (intent == null) {
      stopSelf();
      return START_NOT_STICKY;
    }

    String action = intent.getAction();
    if (ACTION_STOP.equals(action)) {
      stopTracking();
      stopSelf();
      return START_NOT_STICKY;
    }

    intervalMs = intent.getLongExtra(EXTRA_INTERVAL_MS, 5 * 60 * 1000L);
    if (intervalMs < 60_000L) {
      intervalMs = 60_000L;
    }

    String title = intent.getStringExtra(EXTRA_TITLE);
    String message = intent.getStringExtra(EXTRA_MESSAGE);
    if (title == null || title.isEmpty()) title = "МП СТГО";
    if (message == null || message.isEmpty()) message = "Отслеживание местоположения";

    Notification notification = buildNotification(title, message);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      startForeground(
        NOTIFICATION_ID,
        notification,
        ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
      );
    } else {
      startForeground(NOTIFICATION_ID, notification);
    }

    if (!running) {
      running = true;
      handler.post(tickRunnable);
    }

    return START_NOT_STICKY;
  }

  @Override
  public void onDestroy() {
    stopTracking();
    super.onDestroy();
  }

  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }

  private void stopTracking() {
    running = false;
    handler.removeCallbacks(tickRunnable);
    removeLocationListener();
    stopForeground(STOP_FOREGROUND_REMOVE);
  }

  private void removeLocationListener() {
    if (locationManager != null && locationListener != null) {
      try {
        locationManager.removeUpdates(locationListener);
      } catch (Exception e) {
        Log.w(TAG, "removeUpdates", e);
      }
      locationListener = null;
    }
  }

  private boolean hasLocationPermission() {
    return ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION)
        == PackageManager.PERMISSION_GRANTED
      || ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION)
        == PackageManager.PERMISSION_GRANTED;
  }

  private void requestOneFix() {
    if (!hasLocationPermission() || locationManager == null) {
      Log.w(TAG, "no location permission or manager");
      return;
    }

    try {
      Location last = null;
      if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION)
          == PackageManager.PERMISSION_GRANTED) {
        last = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
      }
      if (last == null) {
        last = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
      }
      if (last != null && System.currentTimeMillis() - last.getTime() < intervalMs) {
        emit(last);
      }

      removeLocationListener();
      locationListener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
          emit(location);
          removeLocationListener();
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {}

        @Override
        public void onProviderEnabled(String provider) {}

        @Override
        public void onProviderDisabled(String provider) {}
      };

      String provider = LocationManager.GPS_PROVIDER;
      if (!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
          && locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
        provider = LocationManager.NETWORK_PROVIDER;
      }

      locationManager.requestLocationUpdates(provider, 0L, 0f, locationListener, Looper.getMainLooper());
    } catch (SecurityException e) {
      Log.w(TAG, "requestOneFix security", e);
    } catch (Exception e) {
      Log.w(TAG, "requestOneFix", e);
    }
  }

  private void emit(Location location) {
    if (location == null) return;
    BackgroundLocationPlugin.emitLocation(
      location.getLatitude(),
      location.getLongitude(),
      location.hasSpeed() ? location.getSpeed() : null,
      location.hasBearing() ? location.getBearing() : null
    );
  }

  private void ensureChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
    NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    if (nm == null) return;
    NotificationChannel channel = new NotificationChannel(
      CHANNEL_ID,
      "Геолокация",
      NotificationManager.IMPORTANCE_LOW
    );
    channel.setDescription("Фоновое отслеживание местоположения");
    channel.setShowBadge(false);
    nm.createNotificationChannel(channel);
  }

  private Notification buildNotification(String title, String message) {
    Intent launch = getPackageManager().getLaunchIntentForPackage(getPackageName());
    if (launch == null) {
      launch = new Intent(this, MainActivity.class);
    }
    launch.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);

    PendingIntent pending = PendingIntent.getActivity(
      this,
      0,
      launch,
      PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
    );

    return new NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle(title)
      .setContentText(message)
      .setSmallIcon(R.mipmap.ic_launcher)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setContentIntent(pending)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .build();
  }
}
