module.exports = {
    apps: [
        {
            name: "api_medical_record_audit",
            script: "server.js",
            interpreter: "node",
            watch: ["server.js", "routes"], // เฝ้าดูไฟล์และโฟลเดอร์ที่ต้องการ
            ignore_watch: ["node_modules", "*.log"], // 忽略ไฟล์ที่ไม่เกี่ยวข้อง
            watch_delay: 1000, // รอ 1 วินาที
            cwd: "/var/www/html/api_medical_record_audit", // ตำแหน่งโปรเจกต์
            env: {
                NODE_ENV: "production",
                BASE_PATH: "api"
            },
            instances: 1,
            exec_mode: "fork"
        }
    ]
};