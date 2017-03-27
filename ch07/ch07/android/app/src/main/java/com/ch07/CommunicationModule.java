package com.ch07;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by yuanlin on 2017/1/23.
 */

public class CommunicationModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext mReactContext;

    public CommunicationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Communication";
    }

    @ReactMethod
    public void startActivityFromReactNative(String activityName, String params) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity != null) {
                Class toActivity = Class.forName(activityName);
                Intent intent = new Intent(currentActivity, toActivity);
                intent.putExtra("params", params);
                currentActivity.startActivity(intent);
            }
        } catch (Exception e) {
            throw new JSApplicationIllegalArgumentException("打开Activity失败: " + e.getMessage());
        }
    }

}
