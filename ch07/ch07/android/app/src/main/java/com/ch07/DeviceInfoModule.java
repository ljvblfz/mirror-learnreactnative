package com.ch07;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Created by yuanlin on 2017/1/23.
 */

public class DeviceInfoModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext mReactContext;

    public DeviceInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DeviceInfo";
    }

    @Override
    public @Nullable
    Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<String, Object>();
        constants.put("systemName", "Android");
        constants.put("systemVersion", Build.VERSION.RELEASE);
        constants.put("deviceLocale", this.getCurrentLanguage());
        constants.put("appVersion", this.getAppVersion());
        return constants;
    }

    private String getCurrentLanguage() {
        Locale current = getReactApplicationContext().getResources().getConfiguration().locale;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            return current.toLanguageTag();
        } else {
            StringBuilder builder = new StringBuilder();
            builder.append(current.getLanguage());
            if (current.getCountry() != null) {
                builder.append("-");
                builder.append(current.getCountry());
            }
            return builder.toString();
        }
    }

    private String getAppVersion() {
        String appVersion = "not available";
        try {
            PackageManager packageManager = this.mReactContext.getPackageManager();
            String packageName = this.mReactContext.getPackageName();
            PackageInfo info = packageManager.getPackageInfo(packageName, 0);
            appVersion = info.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return appVersion;
    }

}
