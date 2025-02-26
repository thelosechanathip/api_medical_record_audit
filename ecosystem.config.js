module.exports = {
    apps: [
        {
            name: "api_medical_record_audit",  // ตั้งชื่อแอป
            script: "npm",
            args: "start",
            interpreter: "/bin/bash",
            watch: true, // ให้เฝ้าดูการเปลี่ยนแปลงไฟล์
            env: {
            NODE_ENV: "production",
            },
        },
    ],
};
  