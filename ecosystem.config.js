module.exports = {
    apps: [
        {
            name: "api_medical_record_audit",
            script: "server.js", // รันไฟล์หลักโดยตรง
            interpreter: "node", // ใช้ Node.js เป็น interpreter
            watch: true, // เฝ้าดูการเปลี่ยนแปลงไฟล์
            env: {
                NODE_ENV: "production",
                BASE_PATH: "api" // ถ้ามีใน .env
            },
            instances: 1,
            exec_mode: "fork" // รันในโหมด fork
        }
    ]
};