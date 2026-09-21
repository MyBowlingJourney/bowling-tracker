package com.mybowlingjourney.app;

import android.content.Intent;
import android.util.Log;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginHandle;

import ee.forgr.capacitor.social.login.GoogleProvider;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;
import ee.forgr.capacitor.social.login.SocialLoginPlugin;

// Native Google sign-in needs this activity to hand Google's result back.
//
// The sign-in sheet is launched by @capgo/capacitor-social-login, but
// Android delivers the result to the ACTIVITY, not to the plugin. The
// stock Capacitor MainActivity has no onActivityResult, so the result
// arrived and went nowhere: the JS promise never resolved, and the app sat
// on "Opening Google..." forever with no error to read. A hang rather than
// a failure is the signature of this step being missing.
//
// The interface is the plugin's own tripwire -- it checks for it and
// refuses to work if the activity does not implement it. The method with
// the unwieldy name is empty on purpose; implementing it is the whole
// point.
//
// Only the Google request-code range is intercepted. Everything else still
// goes to super, so no other plugin's activity results are affected.
public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode >= GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN
                && requestCode < GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MAX) {
            PluginHandle pluginHandle = getBridge().getPlugin("SocialLogin");
            if (pluginHandle == null) {
                Log.i("Google Activity Result", "SocialLogin login handle is null");
                return;
            }
            Plugin plugin = pluginHandle.getInstance();
            if (!(plugin instanceof SocialLoginPlugin)) {
                Log.i("Google Activity Result", "SocialLogin plugin instance is not SocialLoginPlugin");
                return;
            }
            ((SocialLoginPlugin) plugin).handleGoogleLoginIntent(requestCode, data);
        }
    }

    @Override
    public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {}
}
