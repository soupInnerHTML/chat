const originalConsoleError = console.error;

if (process.env.NODE_ENV !== 'production') {
    console.error = (...args) => {
        if (args[0] && args[0].includes('Your VirtuosoMessageListLicense component is missing a license key')) {
            return;
        }
        originalConsoleError(...args);
    };
}
