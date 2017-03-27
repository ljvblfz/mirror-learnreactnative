package com.ch07;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.BitmapFactory;
import android.graphics.BitmapFactory.Options;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v7.app.AlertDialog;
import android.text.TextUtils;
import android.widget.ArrayAdapter;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created by yuanlin on 2017/1/23.
 */

public class ImagePickerModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    static final int REQUEST_LAUNCH_IMAGE_CAPTURE = 13001;
    static final int REQUEST_LAUNCH_IMAGE_LIBRARY = 13002;
    static final int IMAGE_PICKER_TARGET_IMAGE = 0;
    static final int IMAGE_PICKER_TARGET_CAMERA = 1;
    private final ReactApplicationContext mReactContext;
    private Callback mCallback;
    private WritableMap mResponse;
    private Uri mCameraCaptureURI;
    private int mImagePickerTargetType;

    public ImagePickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "ImagePicker";
    }

    @ReactMethod
    public void launchImageLibrary(final ReadableMap options, final Callback callback) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            return;
        }

        // 创建AlertDialog.Builder
        AlertDialog.Builder builder = new AlertDialog.Builder(currentActivity, android.R.style.Theme_Holo_Light_Dialog);
        builder.setTitle("相片库");

        // 设置AlertDialog的Adapter
        final List<String> titles = new ArrayList<String>();
        final List<String> actions = new ArrayList<String>();
        titles.add("相册");
        actions.add("photo");
        titles.add("相机");
        actions.add("camera");
        titles.add("取消");
        actions.add("cancel");
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(currentActivity, android.R.layout.select_dialog_item, titles);
        builder.setAdapter(adapter, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int index) {
                mResponse = Arguments.createMap();
                String action = actions.get(index);
                switch (action) {
                    case "photo":
                        mImagePickerTargetType = IMAGE_PICKER_TARGET_IMAGE;
                        launchImagePicker(options, callback);
                        break;
                    case "camera":
                        mImagePickerTargetType = IMAGE_PICKER_TARGET_CAMERA;
                        launchImagePicker(options, callback);
                        break;
                    case "cancel":
                        mResponse.putBoolean("didCancel", true);
                        callback.invoke(mResponse);
                        break;
                    default:
                        break;
                }
            }
        });

        // 创建AlertDialog
        final AlertDialog dialog = builder.create();
        dialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                mResponse = Arguments.createMap();
                dialog.dismiss();
                mResponse.putBoolean("didCancel", true);
                callback.invoke(mResponse);
            }
        });

        // 显示AlertDialog
        dialog.show();
    }

    @ReactMethod
    public void launchImagePicker(final ReadableMap options, final Callback callback) {
        // 判断设备是否支持相机
        if (mImagePickerTargetType == IMAGE_PICKER_TARGET_CAMERA && !isCameraAvailable()) {
            return;
        }

        mCallback = callback;
        mResponse = Arguments.createMap();

        Intent libraryIntent = null;
        if (mImagePickerTargetType == IMAGE_PICKER_TARGET_IMAGE) {
            libraryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        } else if (mImagePickerTargetType == IMAGE_PICKER_TARGET_CAMERA) {
            libraryIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            mCameraCaptureURI = Uri.fromFile(createNewFile());
            libraryIntent.putExtra(MediaStore.EXTRA_OUTPUT, mCameraCaptureURI);
        }

        try {
            // 打开相册或相机
            int requestCode = mImagePickerTargetType == IMAGE_PICKER_TARGET_IMAGE ?
                    REQUEST_LAUNCH_IMAGE_LIBRARY : REQUEST_LAUNCH_IMAGE_CAPTURE;
            Activity currentActivity = getCurrentActivity();
            currentActivity.startActivityForResult(libraryIntent, requestCode);
        } catch (ActivityNotFoundException e) {
            e.printStackTrace();
            if (mCallback != null) {
                mResponse.putString("error", "Cannot launch photo library");
                mCallback.invoke(mResponse);
                mCallback = null;
            }
        }
    }

    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        mResponse = Arguments.createMap();

        // 用户取消
        if (resultCode != Activity.RESULT_OK) {
            mResponse.putBoolean("didCancel", true);
            mCallback.invoke(mResponse);
            mCallback = null;
            return;
        }

        // 获取图片uri
        Uri uri;
        switch (requestCode) {
            case REQUEST_LAUNCH_IMAGE_CAPTURE:
                uri = mCameraCaptureURI;
                break;
            case REQUEST_LAUNCH_IMAGE_LIBRARY:
                uri = data.getData();
                break;
            default:
                uri = null;
        }
        String realPath = getRealPathFromURI(uri);

        if (!TextUtils.isEmpty(realPath)) {
            // 解码图片
            Options options = new Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(realPath, options);

            // 回调函数
            mResponse.putString("uri", uri.toString());
            mResponse.putString("path", realPath);
            mCallback.invoke(mResponse);
            mCallback = null;
        } else {
            if (mCallback != null) {
                mResponse.putString("error", "Cannot launch photo library");
                mCallback.invoke(mResponse);
                mCallback = null;
            }
        }
    }

    public void onNewIntent(Intent intent) {
    }

    private String getRealPathFromURI(Uri uri) {
        String result;
        String[] projection = {MediaStore.Images.Media.DATA};
        if (uri == null || TextUtils.isEmpty(uri.toString())) {
            return "";
        }
        Cursor cursor = mReactContext.getContentResolver().query(uri, projection, null, null, null);
        if (cursor == null) {
            result = uri.getPath();
        } else {
            cursor.moveToFirst();
            int idx = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            result = cursor.getString(idx);
            cursor.close();
        }
        return result;
    }

    private boolean isCameraAvailable() {
        return mReactContext.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)
                || mReactContext.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY);
    }

    private File createNewFile() {
        String filename = "image-" + UUID.randomUUID().toString() + ".jpg";
        File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
        File f = new File(path, filename);
        try {
            path.mkdirs();
            f.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return f;
    }

}
