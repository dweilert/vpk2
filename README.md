# vpk

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run server.js
```

This project was created using `bun init` in bun v1.1.30. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Known issues with error message in browser console: `CONTEXT_LOST_WEBGL`

The `CONTEXT_LOST_WEBGL` error in Chrome indicates that the WebGL context (the part of the browser responsible for managing GPU resources) has been lost. This issue can have several causes, especially when it appears in one browser but not another. Here are some common reasons and potential fixes:

### 1. **Graphics Resource Limits**
   - WebGL context loss can occur if your application is using too many graphics resources, such as textures, shaders, or framebuffers. Chrome may be more sensitive to these limits compared to Firefox.
   - **Solution**: Try optimizing your WebGL usage:
     - Reduce texture sizes or the number of textures loaded at once.
     - Minimize memory usage by reusing resources where possible.
     - Ensure you properly dispose of any unused WebGL resources.

### 2. **Chrome’s GPU Process Limitations**
   - Chrome has stricter policies regarding the GPU process and may kill the WebGL context if the GPU is under high load.
   - **Solution**: You can try disabling `chrome://flags/#enable-gpu-rasterization` to see if it helps with context stability.

### 3. **Background Tab Throttling**
   - Chrome may release WebGL contexts more aggressively when they are in background tabs to save memory. If your page is often in the background, this could trigger context loss.
   - **Solution**: Keep the WebGL page in the foreground, or minimize GPU usage in background tabs.

### 4. **Driver or Hardware-Specific Issues**
   - Chrome may have issues with specific GPU drivers, especially if they’re outdated or have known issues.
   - **Solution**: Ensure your graphics drivers are updated. You can check for Chrome’s compatibility with your hardware and driver by visiting `chrome://gpu` and reviewing the "Graphics Feature Status." Look for any "Software only" or "Hardware acceleration disabled" statuses.

### 5. **Check Chrome’s WebGL Settings**
   - In Chrome, you can try enabling or disabling the `ANGLE` backend:
     - Open `chrome://flags/#use-angle` and experiment with different options (`D3D11`, `OpenGL`, `Metal` on Mac, etc.).
   - Sometimes, switching ANGLE renderers can resolve context loss issues depending on your graphics hardware.


If the issue persists after trying these steps, it could indicate a Chrome-specific bug with your hardware. You might consider reporting it to Chrome’s development team, providing details on your GPU, OS, and steps to reproduce the error.