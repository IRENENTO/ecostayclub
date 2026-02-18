# EmailJS Setup Guide - Fix for "Recipients Address is Empty" & Missing Template Variables

## ❌ Current Issues

### Issue 1: Email Received but Variables Show Empty
When a user joins, the email shows:
```
Hello ,
Welcome to EcoStay 🌿
```

**Cause**: Template has `{{to_name}}` but it's:
- Not in the email body
- Spelled differently than the parameter name
- Not wrapped in `{{double_curly_braces}}`

### Issue 2: Recipients Address is Empty (HTTP 422)
Error: `'The recipients address is empty'`

**Cause**: Template's "To Email" field not set to a dynamic variable

---

## ✅ Solution: Fix your EmailJS Template

### Step 1: Go to EmailJS Dashboard
1. Visit: https://dashboard.emailjs.com/admin/templates
2. Find **`template_1a3m2xk`** (Welcome Template)
3. Click **Edit**

### Step 2: Configure "To Email" Field
In the **Email Template Settings** section:
- **To Email**: `{{to_email}}`
- **From Name**: `EcoStay Club`
- **Subject**: `Welcome to EcoStay Club!`

### Step 3: Update Email Body
Replace the entire email body with:

```
Hello {{to_name}},

Welcome to EcoStay 🌿

We're truly happy to have you join the EcoStay Sustainable Community!

Your Registration Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Name: {{fullName}}
📧 Email: {{to_email}}
📱 WhatsApp: {{whatsapp}}
🏫 Faculty: {{faculty}}
📅 Year of Study: {{year}}
💝 Interests: {{interests}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{message}}

Next Steps:
1. Keep an eye on our WhatsApp for updates
2. Attend our upcoming events
3. Start making impact today!

Best regards,
🌱 EcoStay Club Team
Kigali, Rwanda
info@ecostay.org
```

### Step 4: Test Template
1. Click **Test it** button
2. Fill in test values:
   ```
   to_email: blackoboy48@gmail.com
   to_name: John Doe
   fullName: John Doe
   whatsapp: +250 700 000 000
   faculty: Computer Science
   year: 2024
   interests: Environmental Action
   message: Welcome message here
   ```
3. Click **Send Test Email**
4. Check your inbox for the test email

### Step 5: Verify Variables Match Code

The code sends these parameters:
```javascript
{
  to_email: email,           // MUST be "To Email" field value
  to_name: fullName,         // Used in "Hello {{to_name}},"
  fullName: fullName,        // {{fullName}} in body
  whatsapp: whatsapp,        // {{whatsapp}} in body
  faculty: faculty,          // {{faculty}} in body
  year: year,                // {{year}} in body
  interests: interests,      // {{interests}} in body
  message: "welcome msg"     // {{message}} in body
}
```

**Your template must use these EXACT variable names:**
- ✅ `{{to_email}}` - In "To Email" field
- ✅ `{{to_name}}` - In subject or body
- ✅ `{{fullName}}` - In email body
- ✅ `{{whatsapp}}` - In email body
- ✅ `{{faculty}}` - In email body
- ✅ `{{year}}` - In email body
- ✅ `{{interests}}` - In email body
- ✅ `{{message}}` - In email body

---

## 🧪 How to Debug

### Open Browser Console:
1. Press **F12**
2. Go to **Console** tab
3. Submit the join form

You should see:
```
📧 Sending email with params: {
  to_email: "user@email.com",
  to_name: "User Full Name",
  fullName: "User Full Name",
  ...
}
✅ Email sent successfully!
✅ Check your email: user@email.com
```

**If you see error messages, share them here.**

### Check Email Service:
1. Go to https://dashboard.emailjs.com/admin/services
2. Click your **Gmail service** (`service_jjh15de`)
3. Verify:
   - ✅ "Service is connected" (green)
   - ✅ No error messages
   - ✅ Quota not exceeded

### Common Variable Issues:

| Problem | Solution |
|---------|----------|
| `Hello ,` appears | Add `{{to_name}}` to template body |
| `{{to_name}}` shows literal | Use 2 curly braces: `{{` not `{{` |
| Empty faculty/year/interests | These fields might be optional - set defaults |
| "Recipients address is empty" | Set "To Email" field to `{{to_email}}` |
| Email not received | Check Gmail spam folder |

---

## 📋 Template Checklist

Before testing with users:
- [ ] "To Email" field contains `{{to_email}}`
- [ ] Email body contains `{{to_name}}`
- [ ] All variables wrapped in `{{double_curly_braces}}`
- [ ] Variable names match code parameters exactly
- [ ] Test email sends successfully
- [ ] Test email received with filled variables
- [ ] No error messages in EmailJS dashboard
- [ ] Monthly quota not exceeded

---

## 🚀 After Fixing

1. **Save template changes** in EmailJS
2. **Hard refresh** your app (`Ctrl + Shift + R`)
3. **Register a test user**
4. **Check console** (F12) for the parameters
5. **Check email inbox** within 30 seconds
6. **Verify all variables populated** (not empty)

---

## 📞 Need More Help?

If email variables are still empty after these steps:

1. **Share the email body text** from your template
2. **Share console output** when you submit the form
3. **Check if template was saved** in EmailJS

---

## Service Configuration Reference

- **Service ID**: `service_jjh15de`
- **Template ID**: `template_1a3m2xk`
- **Public Key**: `NO2bFJR-pvSXk-KXs`
- **Dashboard**: https://dashboard.emailjs.com/


