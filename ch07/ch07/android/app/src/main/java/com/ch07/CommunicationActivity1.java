package com.ch07;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

/**
 * Created by yuanlin on 2017/1/23.
 */

public class CommunicationActivity1 extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.communication_activity1);

        Intent intent = getIntent();
        if (intent != null) {
            String params = intent.getStringExtra("params");
            if (params != null) {
                Toast.makeText(this, "从React Native传来的数据是: " + params, Toast.LENGTH_SHORT).show();
            }
        }
    }

}
