package com.ch06;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yuanlin on 2017/2/6.
 */

public class PlatformModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext mReactContext;

    public PlatformModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Platform"; // 模块名称
    }

    @Override
    public @Nullable
    Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<String, Object>();
        constants.put("systemName", "android");
        return constants; // 返回键值对
    }
}
