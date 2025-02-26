module.exports = {
    apps: [
        {
            name: "api_medical_record_audit",
            script: "server.js",
            interpreter: "node",
            watch: ["server.js", "routes"], // เฝ้าดู server.js และโฟลเดอร์ routes
            ignore_watch: ["node_modules", "*.log"], // 忽略โฟลเดอร์/ไฟล์ที่ไม่ต้องการ
            env: {
                NODE_ENV: "production",
                BASE_PATH: "api"
            },
            instances: 1,
            exec_mode: "fork"
        }
    ]
};