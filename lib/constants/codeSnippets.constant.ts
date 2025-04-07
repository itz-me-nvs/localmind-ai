export const SNIPPETS = {
    debounce: {
        title: 'Debounce Function',
        description: 'Delays the execution of a function until after a specified wait time has elapsed since the last time it was invoked.',
        inputs: ['functionName', 'waitTime'],
        defaultValues: ['debounce', '1000'],
        template: ({ functionName, waitTime }: { functionName: string; waitTime: string }) => `function ${functionName}(func, delay = ${waitTime}) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }`
      },
      deepCopy: {
        title: 'Deep Copy Function',
        description: 'Creates a deep copy of an object using JSON serialization.',
        inputs: [],
        defaultValues: [],
        template: () => `function deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj));
    }`
      },
      arrayChunk: {
        title: 'Array Chunk',
        description: 'Splits an array into smaller arrays of specified size.',
        inputs: ['functionName','arrayName', 'chunkSize'],
        defaultValues: ['chunkArray', 'myArray', '2'],
        template: ({ arrayName, chunkSize, functionName= 'chunkArray' }: { arrayName: string; chunkSize: string, functionName: string }) => `function ${functionName}(${arrayName}, size = ${chunkSize}) {
      const result = [];
      for (let i = 0; i < ${arrayName}.length; i += size) {
        result.push(${arrayName}.slice(i, i + size));
      }
      return result;
    }`
      },
      isEmptyObject: {
        title: 'Check if Object is Empty',
        description: 'Checks whether an object has no properties and is a plain object.',
        inputs: ['objectName'],
        defaultValues: ['obj'],
        template: ({ objectName }: { objectName: string }) => `function isEmpty(${objectName}) {
      return Object.keys(${objectName}).length === 0 && ${objectName}.constructor === Object;
    }`
      },
      capitalize: {
        title: 'Capitalize First Letter',
        description: 'Capitalizes the first character of a given string.',
        inputs: ['inputStr'],
        defaultValues: ['text'],
        template: ({ inputStr }: { inputStr: string }) => `function capitalize(${inputStr}) {
      return ${inputStr}.charAt(0).toUpperCase() + ${inputStr}.slice(1);
    }`
      },
      copyToClipboard: {
        title: 'Copy to Clipboard',
        description: 'Copies a given text string to the clipboard using Clipboard API.',
        inputs: ['text'],
        defaultValues: ['textToCopy'],
        template: ({ text }: { text: string }) => `function copyToClipboard(${text}) {
      navigator.clipboard.writeText(${text});
    }`
      },
      randomId: {
        title: 'Generate Random ID',
        description: 'Generates a random string identifier with a custom prefix.',
        inputs: ['prefix'],
        defaultValues: ['id'],
        template: ({ prefix }: { prefix: string }) => `function generateId() {
      return '${prefix}-' + Math.random().toString(36).substr(2, 9);
    }`
      },
      flattenArray: {
        title: 'Flatten Array',
        description: 'Flattens a nested array structure into a single-level array.',
        inputs: ['arrayName'],
        defaultValues: ['arr'],
        template: ({ arrayName }: { arrayName: string }) => `function flatten(${arrayName}) {
      return ${arrayName}.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
    }`
      },
      throttle: {
        title: 'Throttle Function',
        description: 'Limits the execution of a function to once per specified interval.',
        inputs: ['functionName', 'interval'],
        defaultValues: ['throttle', '200'],
        template: ({ functionName, interval }: { functionName: string; interval: string }) => `function ${functionName}(func, limit = ${interval}) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      }
    }`
      },
      capitalizeString: {
        title: 'Capitalize First Letter of String',
        description: 'Capitalizes the first letter of a string variable.',
        inputs: ['stringVar'],
        defaultValues: ['str'],
        template: ({ stringVar }: { stringVar: string }) => `function capitalize(${stringVar}) {
      return ${stringVar}.charAt(0).toUpperCase() + ${stringVar}.slice(1);
    }`
      },
      generateUUID: {
        title: 'Generate UUID v4',
        description: 'Generates a RFC4122 version 4 UUID string.',
        inputs: [],
        defaultValues: [],
        template: () => `function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }`
      },
      removeDuplicates: {
        title: 'Remove Duplicates from Array',
        description: 'Removes duplicate entries from an array using Set.',
        inputs: ['arrayName'],
        defaultValues: ['arr'],
        template: ({ arrayName }: { arrayName: string }) => `function removeDuplicates(${arrayName}) {
      return [...new Set(${arrayName})];
    }`
      },
      downloadFile: {
        title: 'Download Text as File',
        description: 'Downloads a plain text file with the specified filename and content.',
        inputs: ['filename', 'content'],
        defaultValues: ['file.txt', 'Hello, world!'],
        template: ({ filename, content }: { filename: string; content: string }) => `function downloadFile(filename = '${filename}', content = '${content}') {
          const blob = new Blob([content], { type: 'text/plain' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          URL.revokeObjectURL(link.href);
        }`
      },
      
      downloadBlob: {
        title: 'Download Blob File',
        description: 'Creates and downloads a file as a Blob object with specified MIME type.',
        inputs: ['filename', 'blobType', 'content'],
        defaultValues: ['data.bin', 'application/octet-stream', 'Binary data'],
        template: ({ filename, blobType, content } : { filename: string; blobType: string; content: string }) => `function downloadBlob(filename = '${filename}', type = '${blobType}', content = '${content}') {
          const blob = new Blob([content], { type });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          URL.revokeObjectURL(link.href);
        }`
      },
      
      fileToBase64: {
        title: 'Convert File to Base64',
        description: 'Converts an uploaded file into a Base64-encoded string.',
        inputs: ['fileVar'],
        defaultValues: ['file'],
        template: ({ fileVar } : { fileVar: string }) => `function fileToBase64(${fileVar}) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(${fileVar});
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
        }`
      },
      
      base64ToBlob: {
        title: 'Convert Base64 to Blob',
        description: 'Converts a Base64-encoded string back into a Blob with a given MIME type.',
        inputs: ['base64Data', 'mimeType'],
        defaultValues: ['base64String', 'application/octet-stream'],
        template: ({ base64Data, mimeType } : { base64Data: string; mimeType: string }) => `function base64ToBlob(base64, type = '${mimeType}') {
          const byteCharacters = atob(base64.split(',')[1]);
          const byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
          }
          return new Blob(byteArrays, { type });
        }`
      },
      
      getGeolocation: {
        title: 'Get User Geolocation',
        description: 'Retrieves the user’s current latitude and longitude coordinates.',
        inputs: [],
        defaultValues: [],
        template: () => `navigator.geolocation.getCurrentPosition((position) => {
          console.log(position.coords.latitude, position.coords.longitude);
        }, (error) => {
          console.error('Error getting location:', error);
        });`
      },
      
      checkOnlineStatus: {
        title: 'Check If User Is Online',
        description: 'Checks if the user is currently connected to the internet.',
        inputs: [],
        defaultValues: [],
        template: () => `const isOnline = navigator.onLine;
        console.log('User online:', isOnline);`
      },
      
      listenClipboardPaste: {
        title: 'Listen to Clipboard Paste',
        description: 'Adds a listener to log pasted clipboard text into the console.',
        inputs: [],
        defaultValues: [],
        template: () => `document.addEventListener('paste', (event) => {
          const pasteData = (event.clipboardData || window.clipboardData).getData('text');
          console.log('Pasted content:', pasteData);
        });`
      },
      
      detectVisibilityChange: {
        title: 'Detect Page Visibility Change',
        description: 'Detects when the browser tab becomes hidden or visible.',
        inputs: [],
        defaultValues: [],
        template: () => `document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            console.log('Tab is hidden');
          } else {
            console.log('Tab is visible');
          }
        });`
      },
      
      scrollToElement: {
        title: 'Scroll to Element Smoothly',
        description: 'Scrolls smoothly to the element with the specified ID.',
        inputs: ['elementId'],
        defaultValues: ['section1'],
        template: ({ elementId }: { elementId: string }) => `document.getElementById('${elementId}')?.scrollIntoView({
          behavior: 'smooth'
        });`
      },
      
      triggerVibration: {
        title: 'Trigger Device Vibration (Mobile)',
        description: 'Triggers device vibration for the specified duration (in ms).',
        inputs: ['duration'],
        defaultValues: ['200'],
        template: ({ duration } : { duration: string }) => `if (navigator.vibrate) {
          navigator.vibrate(${duration});
        }`
      },
      
      detectDarkMode: {
        title: 'Detect Dark Mode Preference',
        description: 'Detects if the user’s system is set to dark mode.',
        inputs: [],
        defaultValues: [],
        template: () => `const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('User prefers dark mode:', prefersDark);`
      },
      
      requestNotificationPermission: {
        title: 'Request Notification Permission',
        description: 'Asks the user for notification permissions and sends a sample notification.',
        inputs: [],
        defaultValues: [],
        template: () => `Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Hello from Web API!');
          }
        });`
      },
      
      openNewTab: {
        title: 'Open URL in New Tab',
        description: 'Opens a specified URL in a new browser tab.',
        inputs: ['url'],
        defaultValues: ['https://example.com'],
        template: ({ url } : { url: string }) => `window.open('${url}', '_blank');`
      },
      
      fullscreenToggle: {
        title: 'Toggle Fullscreen Mode',
        description: 'Toggles fullscreen mode for the current webpage.',
        inputs: [],
        defaultValues: [],
        template: () => `function toggleFullscreen() {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }
        }`
      },
      
      checkCookiesEnabled: {
        title: 'Check if Cookies are Enabled',
        description: 'Checks whether the user’s browser has cookies enabled.',
        inputs: [],
        defaultValues: [],
        template: () => `const cookiesEnabled = navigator.cookieEnabled;
        console.log('Cookies Enabled:', cookiesEnabled);`
      },
      
      printPage: {
        title: 'Print Current Page',
        description: 'Opens the print dialog for the current page.',
        inputs: [],
        defaultValues: [],
        template: () => `window.print();`
      },
      
      shareAPI: {
        title: 'Use Web Share API',
        description: 'Triggers the native sharing dialog on supported devices.',
        inputs: ['title', 'text', 'url'],
        defaultValues: ['My App', 'Check this out!', 'https://example.com'],
        template: ({ title, text, url } : { title: string, text: string, url: string }) => `if (navigator.share) {
          navigator.share({
            title: '${title}',
            text: '${text}',
            url: '${url}'
          })
          .then(() => console.log('Shared successfully'))
          .catch((error) => console.error('Share failed:', error));
        }`
      },
      
      batteryStatus: {
        title: 'Check Battery Status',
        description: 'Retrieves the device’s current battery level and charging status.',
        inputs: [],
        defaultValues: [],
        template: () => `navigator.getBattery().then((battery) => {
          console.log('Battery level:', battery.level * 100 + '%');
          console.log('Is charging:', battery.charging);
        });`
      }
      
  
  };