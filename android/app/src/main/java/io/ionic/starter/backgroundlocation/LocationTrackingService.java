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
  private static final long FIX_TIMEOUT_MS = 20_000L;

  private final Handler handler = new Handler(Looper.getMainLooper());
  private LocationManager locationManager;
  private LocationListener locationListener;
  private long intervalMs = 15_000L;
  private boolean running = false;
  private boolean awaitingFix = false;

  private final Runnable tickRunnable = new Runnable() {
    @Override
    public void run() {
      if (!running) return;
      requestOneFix();
      handler.postDelayed(this, intervalMs);
    }
  };

  private final Runnable fixTimeoutRunnable = new Runnable() {
    @Override
    public void run() {
      if (!awaitingFix) return;
      awaitingFix = false;
      removeLocationListener();
      Log.w(TAG, "no fix within " + FIX_TIMEOUT_MS + "ms");
    }
  };

  @Override
  public void onCreate() {
    super.onCreate();
    locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    ensureChannel();
    Log.i(TAG, "onCreate");
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    if (intent == null) {
      Log.w(TAG, "onStartCommand null intent");
      stopSelf();
      return START_NOT_STICKY;
    }

    String action = intent.getAction();
    if (ACTION_STOP.equals(action)) {
      Log.i(TAG, "ACTION_STOP");
      stopTracking();
      stopSelf();
      return START_NOT_STICKY;
    }

    intervalMs = intent.getLongExtra(EXTRA_INTERVAL_MS, 15_000L);
    if (intervalMs < 5_000L) {
      intervalMs = 5_000L;
    }

    String title = intent.getStringExtra(EXTRA_TITLE);
    String message = intent.getStringExtra(EXTRA_MESSAGE);
    if (title == null || title.isEmpty()) title = "МП СТГО";
    if (message == null || message.isEmpty()) message = "Отслеживание местоположения";

    Log.i(
      TAG,
      "onStart intervalMs=" + intervalMs
        + " hasPerm=" + hasLocationPermission()
        + " gps=" + isProviderEnabled(LocationManager.GPS_PROVIDER)
        + " net=" + isProviderEnabled(LocationManager.NETWORK_PROVIDER)
    );

    try {
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
    } catch (Exception e) {
      Log.e(TAG, "startForeground failed", e);
      stopSelf();
      return START_NOT_STICKY;
    }

    if (!running) {
      running = true;
      handler.post(tickRunnable);
    }

    return START_NOT_STICKY;
  }

  @Override
  public void onDestroy() {
    Log.i(TAG, "onDestroy");
    stopTracking();
    super.onDestroy();
  }

  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }

  private void stopTracking() {
    running = false;
    awaitingFix = false;
    handler.removeCallbacks(tickRunnable);
    handler.removeCallbacks(fixTimeoutRunnable);
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

  private boolean isProviderEnabled(String provider) {
    try {
      return locationManager != null && locationManager.isProviderEnabled(provider);
    } catch (Exception e) {
      return false;
    }
  }

  private void requestOneFix() {
    Log.i(TAG, "requestOneFix");
    if (!hasLocationPermission() || locationManager == null) {
      Log.w(TAG, "no location permission or manager");
      return;
    }

    try {
      Location best = null;
      if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION)
          == PackageManager.PERMISSION_GRANTED) {
        best = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
      }
      Location net = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
      if (best == null) {
        best = net;
      } else if (net != null && net.getTime() > best.getTime()) {
        best = net;
      }

      // Always emit lastKnown when available (even if older than interval).
      if (best != null) {
        Log.i(TAG, "lastKnown ageMs=" + (System.currentTimeMillis() - best.getTime()));
        emit(best);
      } else {
        Log.w(TAG, "no lastKnown");
      }

      removeLocationListener();
      awaitingFix = true;
      handler.removeCallbacks(fixTimeoutRunnable);
      handler.postDelayed(fixTimeoutRunnable, FIX_TIMEOUT_MS);

      locationListener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
          awaitingFix = false;
          handler.removeCallbacks(fixTimeoutRunnable);
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

      boolean requested = false;
      if (isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
        locationManager.requestLocationUpdates(
          LocationManager.NETWORK_PROVIDER, 0L, 0f, locationListener, Looper.getMainLooper()
        );
        requested = true;
        Log.i(TAG, "requested NETWORK updates");
      }
      if (isProviderEnabled(LocationManager.GPS_PROVIDER)) {
        locationManager.requestLocationUpdates(
          LocationManager.GPS_PROVIDER, 0L, 0f, locationListener, Looper.getMainLooper()
        );
        requested = true;
        Log.i(TAG, "requested GPS updates");
      }
      if (!requested) {
        awaitingFix = false;
        handler.removeCallbacks(fixTimeoutRunnable);
        Log.w(TAG, "no enabled location providers");
      }
    } catch (SecurityException e) {
      Log.w(TAG, "requestOneFix security", e);
    } catch (Exception e) {
      Log.w(TAG, "requestOneFix", e);
    }
  }

  private void emit(Location location) {
    if (location == null) return;
    Log.i(
      TAG,
      "fix lat=" + location.getLatitude()
        + " lon=" + location.getLongitude()
        + (location.hasSpeed() ? " speed=" + location.getSpeed() : "")
        + (location.hasBearing() ? " heading=" + location.getBearing() : "")
    );
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
