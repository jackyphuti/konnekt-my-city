# 🔧 App Showing Blank Screen - Troubleshooting

## 🎯 Problem
App is installed but showing blank screen when launched.

## ✅ Common Causes & Solutions

### **Issue 1: Phone Can't Reach Computer's IP Address**

**Check if phone can reach server:**

On your phone, open Chrome browser and try:
```
http://10.127.40.216:3000
```

**If it doesn't load:**
- Phone is on **different WiFi** than computer
- **Firewall** is blocking port 3000
- **IP address changed** (computer rebooted)

**Solution:**
1. Check your computer's current IP:
   ```bash
   ip addr show | grep "inet "
   ```
   Look for something like `192.168.x.x` or `10.x.x.x`

2. Update `capacitor.config.ts` with correct IP:
   ```bash
   nano capacitor.config.ts
   # Change: http://10.127.40.216:3000 
   # To: http://YOUR_NEW_IP:3000
   ```

3. Rebuild and reinstall:
   ```bash
   npx cap copy
   npm run build
   npx cap sync
   # Rebuild APK in Android Studio
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

### **Issue 2: Server is Stopped**

**Verify server is running:**
```bash
ps aux | grep "npm start"
```

Should show running process. If not:
```bash
cd ~/Documents/Dev/konnekt\ my\ city\ app/my-app
npm start
```

**Expected output:**
```
✓ Starting...
✓ Ready in 2.3s
```

---

### **Issue 3: Phone on Different Network**

**Check phone's network:**
- On phone: Settings → WiFi → Connected to: ___
- On computer: Run: `ifconfig` → Look for WiFi network name and IP

**Both must be on same WiFi network!**

---

### **Issue 4: Port 3000 Blocked by Firewall**

**Check if port is open:**
```bash
sudo netstat -tlnp | grep 3000
```

Should show:
```
tcp    0   0 0.0.0.0:3000  0.0.0.0:*  LISTEN  [PID]/node
```

**If firewall blocking:**
```bash
# Ubuntu/Debian
sudo ufw allow 3000
sudo ufw enable

# Or disable firewall for testing
sudo ufw disable
```

---

### **Issue 5: Try Alternative Approaches**

#### **A. Use Localhost WiFi**
Some phones can access:
```
http://localhost:3000
```

Or if you're testing on same computer:
```
http://127.0.0.1:3000
```

#### **B. Use Android Emulator (Easier)**
```bash
# In Android Studio, the emulator can access
# Instead of your IP, emulator often sees:
http://10.0.2.2:3000

# Edit capacitor.config.ts:
server: {
  url: 'http://10.0.2.2:3000',  // For emulator
  cleartext: true,
}
```

---

### **Issue 6: Network Connection Issues**

**Restart everything:**
```bash
# 1. Stop server
kill %1

# 2. Restart phone WiFi
# On phone: WiFi OFF → Wait 10 sec → WiFi ON

# 3. Restart npm server
npm start

# 4. Restart app on phone
# Force close app → Reopen
```

---

## 🧪 Quick Diagnostic

**Run this to check your setup:**

```bash
# 1. Get your computer IP
echo "Computer IP:"
hostname -I

# 2. Check if server is running
echo "Server status:"
curl -s http://localhost:3000 | head -5

# 3. Check if port is open
echo "Port 3000 status:"
sudo netstat -tlnp | grep 3000

# 4. Check network
echo "WiFi network:"
nmcli device wifi list | head -3
```

---

## 📱 Test on Phone

### **Method 1: Test with Browser**
1. On phone: Open **Chrome**
2. Type: `http://10.127.40.216:3000`
3. Should load full website
4. If works, close Chrome, reopen app

### **Method 2: Check App Logs**
```bash
# See what app is trying to do
adb logcat | grep -i "konnekt\|error\|connection" | head -20
```

---

## 🔄 Full Reset Steps

If nothing works:

1. **Stop server:**
   ```bash
   pkill npm
   ```

2. **Stop app on phone:**
   - Long-press app → Force Stop

3. **Check IP:**
   ```bash
   ip addr show | grep "inet 1"
   ```

4. **Update capacitor.config.ts:**
   - Change IP address to your current IP
   - Save and close

5. **Rebuild:**
   ```bash
   npm start  # In new terminal
   ```

6. **Sync Android:**
   ```bash
   npx cap copy
   npx cap sync
   ```

7. **Rebuild APK:**
   - In Android Studio: Build → Generate APKs → Build APKs

8. **Reinstall:**
   ```bash
   adb uninstall com.konnektmycity.app
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

9. **Retest:** Open app on phone

---

## 💡 What Should Happen

When app launches:
1. ✅ App icon shows "Konnekt My City"
2. ✅ Home page loads (may take 10-15 seconds)
3. ✅ See: Header with logo, navigation buttons
4. ✅ Bottom navigation tabs appear
5. ✅ Can tap tabs to navigate

---

## 🆘 If Still Blank

**Check these:**

| Check | Command | Expected |
|-------|---------|----------|
| Server running | `curl http://localhost:3000` | HTML response |
| Port open | `netstat -tlnp \| grep 3000` | LISTEN status |
| Firewall | `ufw status` | Active or Inactive |
| Phone network | WiFi settings | Same as computer |
| App installed | `adb shell pm list packages` | `com.konnektmycity.app` |

---

**What's your computer's IP address right now?** 
```bash
hostname -I
```

Tell me the output and I can help you fix it! 🚀

---

**Date:** November 13, 2025
**Status:** Troubleshooting Blank Screen
