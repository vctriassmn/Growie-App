// components/AutoHeightWebView.js
import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function AutoHeightWebView({ content }) {
  const [webViewHeight, setWebViewHeight] = useState(100);
  const webViewRef = useRef(null);

  const injectedJavaScript = `
    setTimeout(function() {
      window.ReactNativeWebView.postMessage(
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ).toString()
      );
    }, 500);
    true;
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: content }}
        injectedJavaScript={injectedJavaScript}
        onMessage={(event) => {
          const height = Number(event.nativeEvent.data);
          if (!isNaN(height)) {
            setWebViewHeight(height);
          }
        }}
        style={{
          height: webViewHeight,
          backgroundColor: 'transparent',
        }}
        scrollEnabled={false} // disable scroll, biar native scroll yg kerja
      />
    </View>
  );
}
