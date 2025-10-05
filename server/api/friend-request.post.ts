import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
    if (event.method !== "POST") {
        return { status: 405, message: "Method Not Allowed" };
    }

    try {
        const body = await readBody(event);

        // 验证必填字段
        if (!body.siteName || !body.siteUrl || !body.email) {
            return { status: 400, message: "Missing required fields" };
        }

        // 校验环境变量
        const smtpHost = process.env.SMTP_HOST;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const senderEmail = process.env.SENDER_EMAIL;
        const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

        if (!smtpHost || !smtpUser || !smtpPass || !senderEmail) {
            console.error("SMTP configuration missing");
            return { status: 500, message: "Internal server error" };
        }

        // 端口类型转换
        const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
        if (isNaN(smtpPort)) {
            console.error("SMTP port configuration invalid");
            return { status: 500, message: "Internal server error" };
        }

        // HTML 转义用户输入
        const siteName = body.siteName;
        const siteUrl = body.siteUrl;
        const description = body.description || "无";
        const email = body.email;
        const avatar = body.avatar || "无";

        // 创建邮件传输器
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // 如果是465端口，设置为true
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        // 邮件内容
        const mailOptions = {
            from: senderEmail,
            to: adminEmail,
            subject: "友链申请 - " + siteName,
            html: `
        <h2>新的友链申请</h2>
        <p><strong>网站名称：</strong> ${siteName}</p>
        <p><strong>网站链接：</strong> <a href="${siteUrl}">${siteUrl}</a></p>
        <p><strong>网站描述：</strong> ${description}</p>
        <p><strong>联系邮箱：</strong> ${email}</p>
        <p><strong>头像链接：</strong> ${avatar}</p>
        <p><strong>申请时间：</strong> ${new Date().toLocaleString()}</p>
      `,
        };

        // 发送邮件
        await transporter.sendMail(mailOptions);

        return { status: 200, message: "申请已提交" };
    } catch (error) {
        console.error("发送邮件失败，错误信息：", error instanceof Error ? error.message : "未知错误");
        return { status: 500, message: "服务器内部错误" };
    }
});
