// Email service using Resend
import { Resend } from 'resend';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

// Initialize Resend client
const resend = config.email.apiKey ? new Resend(config.email.apiKey) : null;

// Email templates
const templates = {
  /**
   * Welcome email for new parents
   */
  welcome: (parentName: string) => ({
    subject: 'Welcome to Orbit Learn! Your Learning Adventure Begins 🚀',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Orbit Learn!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header with Logo -->
    <tr>
      <td style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); border-radius: 24px 24px 0 0; padding: 40px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 120px; height: 120px; border-radius: 20px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Welcome to Orbit Learn!</h1>
        <p style="color: rgba(255,255,255,0.95); margin-top: 10px; font-size: 18px;">Where Learning is an Adventure!</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <h2 style="color: #1e1b4b; margin-top: 0; font-size: 24px;">Hi ${parentName}! 👋</h2>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Thank you for joining Orbit Learn! We're thrilled to have you and your family as part of our learning community.
        </p>

        <!-- Ollie Introduction Box -->
        <div style="background: linear-gradient(135deg, #EDE9FE 0%, #CCFBF1 100%); border-radius: 16px; padding: 24px; margin: 28px 0; text-align: center;">
          <img src="${config.frontendUrl}/assets/images/ollie-avatar.png" alt="Ollie" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 16px;">
          <h3 style="color: #5B21B6; margin: 0 0 12px 0; font-size: 20px;">Meet Ollie, Your Child's AI Tutor!</h3>
          <p style="color: #4b5563; margin: 0; line-height: 1.6;">
            Ollie is a friendly, patient AI tutor who adapts to each child's learning style. With a warm smile and playful personality, Ollie makes education fun with interactive lessons and personalized encouragement from kindergarten through middle school!
          </p>
        </div>

        <h3 style="color: #1e1b4b; font-size: 18px;">Getting Started:</h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
          <tr>
            <td style="padding: 12px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: #7C3AED; color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 16px; vertical-align: middle;">1</td>
                  <td style="padding-left: 16px; color: #4b5563; font-size: 15px;"><strong>Add your children</strong> - Set up profiles for each child</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: #2DD4BF; color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 16px; vertical-align: middle;">2</td>
                  <td style="padding-left: 16px; color: #4b5563; font-size: 15px;"><strong>Upload lesson content</strong> - PDFs, images, or YouTube videos</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: #F59E0B; color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 16px; vertical-align: middle;">3</td>
                  <td style="padding-left: 16px; color: #4b5563; font-size: 15px;"><strong>Watch them learn!</strong> - Ollie will guide them through interactive lessons</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 36px 0;">
          <a href="${config.frontendUrl}/dashboard" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Start Learning Now 🚀
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 24px; margin-bottom: 0; text-align: center;">
          Questions? Reply to this email - we're here to help!<br>
          <span style="color: #9ca3af;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Welcome to Orbit Learn!

Hi ${parentName}!

Thank you for joining Orbit Learn! We're thrilled to have you and your family as part of our learning community.

Meet Ollie, Your Child's AI Tutor!
Ollie is a friendly, patient AI tutor who adapts to each child's learning style. With a warm smile and playful personality, Ollie makes education fun with interactive lessons and personalized encouragement from kindergarten through middle school!

Getting Started:
1. Add your children - Set up profiles for each child
2. Upload lesson content - PDFs, images, or YouTube videos
3. Watch them learn! - Ollie will guide them through interactive lessons

Start learning at: ${config.frontendUrl}/dashboard

Questions? Reply to this email - we're here to help!
- The Orbit Learn Team
    `,
  }),

  /**
   * OTP verification email
   */
  otp: (otp: string, purpose: 'verify_email' | 'reset_password' | 'login') => {
    const purposes = {
      verify_email: {
        title: 'Verify Your Email',
        message: 'Please use the code below to verify your email address.',
        action: 'email verification',
        emoji: '✉️',
      },
      reset_password: {
        title: 'Reset Your Password',
        message: 'You requested to reset your password. Use the code below to proceed.',
        action: 'password reset',
        emoji: '🔐',
      },
      login: {
        title: 'Login Verification',
        message: 'Use the code below to complete your login.',
        action: 'login verification',
        emoji: '🔑',
      },
    };

    const { title, message, action, emoji } = purposes[purpose];

    return {
      subject: `${emoji} ${title} - Orbit Learn`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header with Logo -->
    <tr>
      <td style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">${title}</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px; text-align: center;">
          ${message}
        </p>

        <!-- OTP Code Box -->
        <div style="background: linear-gradient(135deg, #EDE9FE 0%, #CCFBF1 100%); border-radius: 16px; padding: 32px; margin: 28px 0; text-align: center;">
          <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px;">Your verification code:</p>
          <div style="font-size: 44px; font-weight: bold; letter-spacing: 10px; color: #5B21B6; font-family: 'Courier New', monospace; background: #ffffff; padding: 16px 24px; border-radius: 12px; display: inline-block; box-shadow: 0 2px 8px rgba(91, 33, 182, 0.15);">
            ${otp}
          </div>
        </div>

        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          ⏱️ This code expires in <strong>10 minutes</strong>.
        </p>

        <!-- Security Tip -->
        <div style="background-color: #FEF3C7; border-radius: 12px; padding: 16px 20px; margin-top: 24px; border-left: 4px solid #F59E0B;">
          <p style="color: #92400E; margin: 0; font-size: 14px;">
            <strong>🔒 Security tip:</strong> Never share this code with anyone. Orbit Learn will never ask for your code via phone or text.
          </p>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 28px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          If you didn't request this ${action}, please ignore this email or contact support if you have concerns.<br><br>
          <span style="color: #a78bfa;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
${title}

${message}

Your verification code: ${otp}

This code expires in 10 minutes.

Security tip: Never share this code with anyone. Orbit Learn will never ask for your code via phone or text.

If you didn't request this ${action}, please ignore this email or contact support if you have concerns.

- The Orbit Learn Team
      `,
    };
  },

  /**
   * Child added notification email
   */
  childAdded: (parentName: string, childName: string) => ({
    subject: `🎉 ${childName}'s Profile is Ready! - Orbit Learn`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Child Profile Created</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header with Logo -->
    <tr>
      <td style="background: linear-gradient(135deg, #2DD4BF 0%, #7C3AED 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">🎉 ${childName}'s Profile is Ready!</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${parentName}! 👋
        </p>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Great news! <strong>${childName}</strong>'s learning profile has been created and they're ready to start their educational adventure!
        </p>

        <!-- Ollie Excited Box -->
        <div style="background: linear-gradient(135deg, #CCFBF1 0%, #EDE9FE 100%); border-radius: 16px; padding: 24px; margin: 28px 0; text-align: center;">
          <img src="${config.frontendUrl}/assets/images/ollie-avatar.png" alt="Ollie" style="width: 70px; height: 70px; border-radius: 50%; border: 4px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 12px;">
          <p style="color: #065f46; margin: 0; font-size: 16px; font-weight: 500;">
            Ollie is excited to meet <strong>${childName}</strong> and help them explore fun lessons! 🚀
          </p>
        </div>

        <h3 style="color: #1e1b4b; font-size: 18px;">Next Steps:</h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
          <tr>
            <td style="padding: 10px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: #2DD4BF; font-size: 20px; vertical-align: middle; padding-right: 12px;">📚</td>
                  <td style="color: #4b5563; font-size: 15px;">Upload your first lesson for ${childName}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: #7C3AED; font-size: 20px; vertical-align: middle; padding-right: 12px;">💬</td>
                  <td style="color: #4b5563; font-size: 15px;">Let ${childName} chat with Ollie</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: #F59E0B; font-size: 20px; vertical-align: middle; padding-right: 12px;">📊</td>
                  <td style="color: #4b5563; font-size: 15px;">Track their progress in your parent dashboard</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/dashboard/children" style="background: linear-gradient(135deg, #2DD4BF 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(45, 212, 191, 0.4);">
            View ${childName}'s Profile ✨
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <span style="color: #a78bfa;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
${childName}'s Profile is Ready!

Hi ${parentName},

Great news! ${childName}'s learning profile has been created and they're ready to start their educational adventure with Ollie!

Ollie is excited to meet ${childName} and help them explore fun lessons!

Next Steps:
- Upload your first lesson for ${childName}
- Let ${childName} chat with Ollie
- Track their progress in your parent dashboard

View profile at: ${config.frontendUrl}/dashboard/children

- The Orbit Learn Team
    `,
  }),

  /**
   * Weekly progress report email
   */
  weeklyProgress: (
    parentName: string,
    childName: string,
    stats: {
      lessonsCompleted: number;
      timeSpent: string;
      xpEarned: number;
      streak: number;
      badgesEarned: string[];
    }
  ) => ({
    subject: `📊 ${childName}'s Weekly Learning Report - Orbit Learn`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Progress Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header with Logo -->
    <tr>
      <td style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">${childName}'s Weekly Report 📊</h1>
        <p style="color: rgba(255,255,255,0.95); margin-top: 8px; font-size: 16px;">Great progress this week!</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${parentName}! 👋
        </p>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Here's what <strong>${childName}</strong> accomplished this week with Ollie:
        </p>

        <!-- Stats Grid -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
          <tr>
            <td style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 16px; padding: 20px; text-align: center; width: 48%;">
              <div style="font-size: 36px; font-weight: bold; color: #D97706;">📚 ${stats.lessonsCompleted}</div>
              <div style="color: #92400E; font-size: 14px; font-weight: 600; margin-top: 4px;">Lessons Completed</div>
            </td>
            <td style="width: 4%;"></td>
            <td style="background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); border-radius: 16px; padding: 20px; text-align: center; width: 48%;">
              <div style="font-size: 36px; font-weight: bold; color: #2563EB;">⏱️ ${stats.timeSpent}</div>
              <div style="color: #1E40AF; font-size: 14px; font-weight: 600; margin-top: 4px;">Learning Time</div>
            </td>
          </tr>
          <tr><td colspan="3" style="height: 12px;"></td></tr>
          <tr>
            <td style="background: linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%); border-radius: 16px; padding: 20px; text-align: center; width: 48%;">
              <div style="font-size: 36px; font-weight: bold; color: #0D9488;">⭐ ${stats.xpEarned}</div>
              <div style="color: #115E59; font-size: 14px; font-weight: 600; margin-top: 4px;">XP Earned</div>
            </td>
            <td style="width: 4%;"></td>
            <td style="background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%); border-radius: 16px; padding: 20px; text-align: center; width: 48%;">
              <div style="font-size: 36px; font-weight: bold; color: #7C3AED;">🔥 ${stats.streak}</div>
              <div style="color: #5B21B6; font-size: 14px; font-weight: 600; margin-top: 4px;">Day Streak</div>
            </td>
          </tr>
        </table>

        ${stats.badgesEarned.length > 0 ? `
        <!-- Badges Section -->
        <div style="background: linear-gradient(135deg, #CCFBF1 0%, #EDE9FE 100%); border-radius: 16px; padding: 24px; margin: 24px 0; text-align: center;">
          <h3 style="color: #065F46; margin: 0 0 12px 0; font-size: 18px;">🏆 New Badges Earned!</h3>
          <p style="color: #4b5563; margin: 0; font-size: 15px;">
            ${stats.badgesEarned.join(' • ')}
          </p>
        </div>
        ` : ''}

        <!-- Ollie Encouragement -->
        <div style="background-color: #F5F3FF; border-radius: 16px; padding: 20px; margin: 24px 0; text-align: center; border: 2px dashed #C4B5FD;">
          <img src="${config.frontendUrl}/assets/images/ollie-avatar.png" alt="Ollie" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px;">
          <p style="color: #5B21B6; margin: 0; font-size: 15px; font-style: italic;">
            "Keep up the amazing work, ${childName}! Every lesson brings you closer to your goals!" 🌟
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/dashboard/progress" style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            View Full Report 📈
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Keep up the great work! Every lesson brings ${childName} closer to their learning goals.<br><br>
          <span style="color: #a78bfa;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
${childName}'s Weekly Learning Report

Hi ${parentName},

Here's what ${childName} accomplished this week with Ollie:

- Lessons Completed: ${stats.lessonsCompleted}
- Learning Time: ${stats.timeSpent}
- XP Earned: ${stats.xpEarned}
- Day Streak: ${stats.streak}
${stats.badgesEarned.length > 0 ? `- New Badges: ${stats.badgesEarned.join(', ')}` : ''}

"Keep up the amazing work, ${childName}! Every lesson brings you closer to your goals!" - Ollie

View full report at: ${config.frontendUrl}/dashboard/progress

Keep up the great work! Every lesson brings ${childName} closer to their learning goals.

- The Orbit Learn Team
    `,
  }),

  /**
   * Welcome email for new teachers (green color scheme)
   */
  teacherWelcome: (teacherName: string) => ({
    subject: 'Welcome to Orbit Learn for Educators! 🎓',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Orbit Learn for Educators!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header with Logo - Green Theme -->
    <tr>
      <td style="background: linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%); border-radius: 24px 24px 0 0; padding: 40px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 120px; height: 120px; border-radius: 20px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Welcome to Orbit Learn!</h1>
        <p style="color: rgba(255,255,255,0.95); margin-top: 10px; font-size: 18px;">Empowering Educators with AI</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <h2 style="color: #064E3B; margin-top: 0; font-size: 24px;">Hi ${teacherName}! 👋</h2>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Thank you for joining Orbit Learn! We're excited to have you as part of our educator community. Our platform is designed to help you create engaging educational content and streamline your grading workflow.
        </p>

        <!-- AI Features Box -->
        <div style="background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%); border-radius: 16px; padding: 24px; margin: 28px 0; text-align: center;">
          <h3 style="color: #065F46; margin: 0 0 12px 0; font-size: 20px;">Powerful AI Tools at Your Fingertips</h3>
          <p style="color: #047857; margin: 0; line-height: 1.6;">
            Create lessons, quizzes, and flashcards in minutes. Our AI helps you focus on what matters most - teaching and inspiring students.
          </p>
        </div>

        <h3 style="color: #064E3B; font-size: 18px;">What You Can Do:</h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
          <tr>
            <td style="padding: 12px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: #059669; color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 16px; vertical-align: middle;">1</td>
                  <td style="padding-left: 16px; color: #4b5563; font-size: 15px;"><strong>Generate Content</strong> - Create AI-powered lessons, quizzes & flashcards</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: #10B981; color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 16px; vertical-align: middle;">2</td>
                  <td style="padding-left: 16px; color: #4b5563; font-size: 15px;"><strong>Grade Efficiently</strong> - Upload papers and get AI-assisted grading</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: #34D399; color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 16px; vertical-align: middle;">3</td>
                  <td style="padding-left: 16px; color: #4b5563; font-size: 15px;"><strong>Save Time</strong> - Focus on teaching while AI handles the rest</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 36px 0;">
          <a href="${config.frontendUrl}/teacher/dashboard" style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4);">
            Go to Dashboard 🎓
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 24px; margin-bottom: 0; text-align: center;">
          Questions? Reply to this email - we're here to help!<br>
          <span style="color: #10B981;">- The Orbit Learn Team 💚</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Welcome to Orbit Learn for Educators!

Hi ${teacherName}!

Thank you for joining Orbit Learn! We're excited to have you as part of our educator community. Our platform is designed to help you create engaging educational content and streamline your grading workflow.

Powerful AI Tools at Your Fingertips
Create lessons, quizzes, and flashcards in minutes. Our AI helps you focus on what matters most - teaching and inspiring students.

What You Can Do:
1. Generate Content - Create AI-powered lessons, quizzes & flashcards
2. Grade Efficiently - Upload papers and get AI-assisted grading
3. Save Time - Focus on teaching while AI handles the rest

Get started at: ${config.frontendUrl}/teacher/dashboard

Questions? Reply to this email - we're here to help!
- The Orbit Learn Team
    `,
  }),

  /**
   * Teacher trial welcome email (7-day unlimited trial)
   */
  teacherTrialWelcome: (teacherName: string, trialEndDateText: string) => ({
    subject: 'Welcome to Orbit Learn! Your 7-day unlimited trial starts now ✨',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Orbit Learn</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 24px 24px 0 0; padding: 36px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 96px; height: 96px; border-radius: 18px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Unlimited Trial Unlocked</h1>
        <p style="color: rgba(255,255,255,0.92); margin-top: 8px; font-size: 16px;">Make the most of your next 7 days</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 36px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <h2 style="color: #312E81; margin-top: 0; font-size: 22px;">Hi ${teacherName}! 👋</h2>
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Welcome to Orbit Learn! You now have <strong>7 days of unlimited access</strong> to all our AI-powered tools.
        </p>

        <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 16px; padding: 20px; margin: 24px 0;">
          <p style="color: #4338CA; margin: 0; font-size: 15px;">
            Your trial ends on <strong>${trialEndDateText}</strong>.
          </p>
        </div>

        <ul style="color: #4b5563; margin: 0 0 20px 18px; font-size: 15px; line-height: 1.7;">
          <li>Generate unlimited lessons</li>
          <li>Create quizzes and flashcards</li>
          <li>Build substitute teacher plans</li>
          <li>Write IEP goals and more</li>
        </ul>

        <p style="color: #4b5563; line-height: 1.7; font-size: 15px;">
          After your trial, you'll have <strong>30 free credits per month</strong> — or you can upgrade for 500 credits/month.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${config.frontendUrl}/teacher/dashboard" style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: 700; font-size: 15px; display: inline-block;">
            Start Creating →
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 18px; margin: 0;">
          Questions? Reply to this email — we're here to help.<br>
          <span style="color: #6366F1;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Welcome to Orbit Learn!

Hi ${teacherName},

You now have 7 days of unlimited access to all our AI-powered tools.
Your trial ends on ${trialEndDateText}.

After your trial, you'll have 30 free credits per month — or you can upgrade for 500 credits/month.

Start creating: ${config.frontendUrl}/teacher/dashboard

— The Orbit Learn Team
    `,
  }),

  /**
   * Teacher trial expiring email (24 hours remaining)
   */
  teacherTrialExpiring: (teacherName: string, trialEndDateText: string) => ({
    subject: '⏰ Your unlimited trial ends tomorrow',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trial Ending Soon</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%); border-radius: 20px 20px 0 0; padding: 28px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your trial ends tomorrow</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 28px; border-radius: 0 0 20px 20px; box-shadow: 0 4px 18px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; font-size: 16px; line-height: 1.7; margin-top: 0;">
          Hi ${teacherName}, your 7-day unlimited trial ends <strong>tomorrow (${trialEndDateText})</strong>.
        </p>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.7;">
          Upgrade now to keep creating without limits. After your trial, you'll have 30 free credits per month.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${config.frontendUrl}/teacher/billing" style="background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; display: inline-block;">
            Upgrade to Teacher Plus →
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 13px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; margin: 0;">
          — The Orbit Learn Team
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Hi ${teacherName},

Your 7-day unlimited trial ends tomorrow (${trialEndDateText}).
Upgrade now to keep creating without limits. After your trial, you'll have 30 free credits per month.

Upgrade: ${config.frontendUrl}/teacher/billing

— The Orbit Learn Team
    `,
  }),

  /**
   * Teacher trial expired email
   */
  teacherTrialExpired: (teacherName: string) => ({
    subject: 'Your trial has ended — here’s what happens next',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trial Ended</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: #111827; border-radius: 20px 20px 0 0; padding: 26px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your trial has ended</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 28px; border-radius: 0 0 20px 20px; box-shadow: 0 4px 18px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; font-size: 16px; line-height: 1.7; margin-top: 0;">
          Hi ${teacherName}, your 7-day unlimited trial has ended. You now have <strong>30 free credits per month</strong>.
        </p>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.7;">
          Upgrade to Teacher Plus for 500 credits/month, or grab a credit pack for a quick top‑up.
        </p>
        <div style="text-align: center; margin: 22px 0;">
          <a href="${config.frontendUrl}/teacher/billing" style="background: #111827; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; display: inline-block;">
            View Plans →
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 13px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; margin: 0;">
          — The Orbit Learn Team
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Hi ${teacherName},

Your 7-day unlimited trial has ended. You now have 30 free credits per month.
Upgrade to Teacher Plus for 500 credits/month, or grab a credit pack for a quick top‑up.

View plans: ${config.frontendUrl}/teacher/billing

— The Orbit Learn Team
    `,
  }),

  /**
   * OTP verification email for teachers (green color scheme)
   */
  teacherOtp: (otp: string, purpose: 'verify_email' | 'reset_password' | 'login') => {
    const purposes = {
      verify_email: {
        title: 'Verify Your Email',
        message: 'Please use the code below to verify your email address.',
        action: 'email verification',
        emoji: '✉️',
      },
      reset_password: {
        title: 'Reset Your Password',
        message: 'You requested to reset your password. Use the code below to proceed.',
        action: 'password reset',
        emoji: '🔐',
      },
      login: {
        title: 'Login Verification',
        message: 'Use the code below to complete your login.',
        action: 'login verification',
        emoji: '🔑',
      },
    };

    const { title, message, action, emoji } = purposes[purpose];

    return {
      subject: `${emoji} ${title} - Orbit Learn for Educators`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header with Logo - Green Theme -->
    <tr>
      <td style="background: linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">${title}</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px; text-align: center;">
          ${message}
        </p>

        <!-- OTP Code Box - Green Theme -->
        <div style="background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%); border-radius: 16px; padding: 32px; margin: 28px 0; text-align: center;">
          <p style="color: #065F46; margin: 0 0 12px 0; font-size: 14px;">Your verification code:</p>
          <div style="font-size: 44px; font-weight: bold; letter-spacing: 10px; color: #059669; font-family: 'Courier New', monospace; background: #ffffff; padding: 16px 24px; border-radius: 12px; display: inline-block; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.15);">
            ${otp}
          </div>
        </div>

        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          ⏱️ This code expires in <strong>10 minutes</strong>.
        </p>

        <!-- Security Tip - Green Themed -->
        <div style="background-color: #ECFDF5; border-radius: 12px; padding: 16px 20px; margin-top: 24px; border-left: 4px solid #10B981;">
          <p style="color: #065F46; margin: 0; font-size: 14px;">
            <strong>🔒 Security tip:</strong> Never share this code with anyone. Orbit Learn will never ask for your code via phone or text.
          </p>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 28px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          If you didn't request this ${action}, please ignore this email or contact support if you have concerns.<br><br>
          <span style="color: #10B981;">- The Orbit Learn Team 💚</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
${title}

${message}

Your verification code: ${otp}

This code expires in 10 minutes.

Security tip: Never share this code with anyone. Orbit Learn will never ask for your code via phone or text.

If you didn't request this ${action}, please ignore this email or contact support if you have concerns.

- The Orbit Learn Team
      `,
    };
  },

  /**
   * Teacher verification link email (click-to-verify, lower friction than OTP)
   */
  teacherVerificationLink: (teacherName: string, verificationUrl: string) => ({
    subject: 'Verify Your Email - Orbit Learn for Educators',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header with Logo - Green Theme -->
    <tr>
      <td style="background: linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">Verify Your Email</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <h2 style="color: #1e1b4b; margin-top: 0; font-size: 22px;">Hi ${teacherName}!</h2>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          You're almost ready to start creating amazing educational content with Orbit Learn!
          Just click the button below to verify your email address.
        </p>

        <!-- Verify Button - Green Theme -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 12px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);">
            Verify My Email
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          This link expires in <strong>24 hours</strong>.
        </p>

        <!-- Alternative Link -->
        <div style="background-color: #f9fafb; border-radius: 12px; padding: 16px 20px; margin-top: 24px;">
          <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 13px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #059669; margin: 0; font-size: 12px; word-break: break-all;">
            ${verificationUrl}
          </p>
        </div>

        <!-- What's Next Info -->
        <div style="background-color: #ECFDF5; border-radius: 12px; padding: 20px; margin-top: 24px;">
          <p style="color: #065F46; margin: 0 0 12px 0; font-size: 15px; font-weight: 600;">
            Why verify your email?
          </p>
          <ul style="color: #047857; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
            <li>Unlock subscription upgrades</li>
            <li>Purchase credit packs</li>
            <li>Secure your account</li>
          </ul>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 28px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          If you didn't create an account, please ignore this email.<br><br>
          <span style="color: #10B981;">- The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Hi ${teacherName}!

You're almost ready to start creating amazing educational content with Orbit Learn!
Click the link below to verify your email address:

${verificationUrl}

This link expires in 24 hours.

Why verify your email?
- Unlock subscription upgrades
- Purchase credit packs
- Secure your account

If you didn't create an account, please ignore this email.

- The Orbit Learn Team
    `,
  }),

  /**
   * Subscription renewal confirmation (parent)
   */
  subscriptionRenewalParent: (
    parentName: string,
    planName: string,
    amountPaid: string,
    nextBillingDate: string,
    receiptUrl?: string | null,
    invoiceNumber?: string | null
  ) => {
    const receiptSection = receiptUrl
      ? `
        <div style="text-align: center; margin: 24px 0 8px;">
          <a href="${receiptUrl}" style="display: inline-block; background: #ffffff; color: #7C3AED; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; border: 2px solid #C4B5FD;">
            View Receipt
          </a>
        </div>
      `
      : '';

    const invoiceRow = invoiceNumber
      ? `
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Invoice:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${invoiceNumber}</td>
            </tr>
        `
      : '';

    return {
      subject: `✅ Subscription Renewed - ${planName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Renewed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">Subscription Renewed</h1>
        <p style="color: rgba(255,255,255,0.95); margin-top: 8px; font-size: 16px;">
          Thanks for being part of Orbit Learn!
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${parentName},
        </p>
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Your ${planName} subscription has been renewed successfully.
        </p>

        <div style="background: linear-gradient(135deg, #EDE9FE 0%, #CCFBF1 100%); border-radius: 16px; padding: 20px; margin: 24px 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Plan:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Amount Paid:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${amountPaid}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Next Billing Date:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${nextBillingDate}</td>
            </tr>
            ${invoiceRow}
          </table>
        </div>

        <div style="text-align: center; margin: 28px 0 16px;">
          <a href="${config.frontendUrl}/parent/billing" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Manage Billing
          </a>
        </div>
        ${receiptSection}

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Questions? Reply to this email or contact support.<br><br>
          <span style="color: #a78bfa;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Subscription Renewed

Hi ${parentName},

Your ${planName} subscription has been renewed successfully.

Plan: ${planName}
Amount Paid: ${amountPaid}
Next Billing Date: ${nextBillingDate}
${invoiceNumber ? `Invoice: ${invoiceNumber}\n` : ''}${receiptUrl ? `Receipt: ${receiptUrl}\n` : ''}
Manage billing: ${config.frontendUrl}/parent/billing

Questions? Reply to this email or contact support.
- The Orbit Learn Team
      `,
    };
  },

  /**
   * Subscription renewal confirmation (teacher)
   */
  subscriptionRenewalTeacher: (
    teacherName: string,
    planName: string,
    amountPaid: string,
    nextBillingDate: string,
    receiptUrl?: string | null,
    invoiceNumber?: string | null
  ) => {
    const receiptSection = receiptUrl
      ? `
        <div style="text-align: center; margin: 24px 0 8px;">
          <a href="${receiptUrl}" style="display: inline-block; background: #ffffff; color: #059669; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; border: 2px solid #A7F3D0;">
            View Receipt
          </a>
        </div>
      `
      : '';

    const invoiceRow = invoiceNumber
      ? `
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Invoice:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${invoiceNumber}</td>
            </tr>
        `
      : '';

    return {
      subject: `✅ Subscription Renewed - ${planName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Renewed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">Subscription Renewed</h1>
        <p style="color: rgba(255,255,255,0.95); margin-top: 8px; font-size: 16px;">
          Thanks for building with Orbit Learn!
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${teacherName},
        </p>
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Your ${planName} subscription has been renewed successfully.
        </p>

        <div style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-radius: 16px; padding: 20px; margin: 24px 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Plan:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Amount Paid:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${amountPaid}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Next Billing Date:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${nextBillingDate}</td>
            </tr>
            ${invoiceRow}
          </table>
        </div>

        <div style="text-align: center; margin: 28px 0 16px;">
          <a href="${config.frontendUrl}/teacher/billing" style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Manage Billing
          </a>
        </div>
        ${receiptSection}

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Questions? Reply to this email or contact support.<br><br>
          <span style="color: #10B981;">- The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Subscription Renewed

Hi ${teacherName},

Your ${planName} subscription has been renewed successfully.

Plan: ${planName}
Amount Paid: ${amountPaid}
Next Billing Date: ${nextBillingDate}
${invoiceNumber ? `Invoice: ${invoiceNumber}\n` : ''}${receiptUrl ? `Receipt: ${receiptUrl}\n` : ''}
Manage billing: ${config.frontendUrl}/teacher/billing

Questions? Reply to this email or contact support.
- The Orbit Learn Team
      `,
    };
  },

  /**
   * Usage warning email (70% and 90% thresholds)
   */
  usageWarning: (
    parentName: string,
    threshold: 70 | 90,
    lessonsUsed: number,
    lessonsLimit: number,
    lessonsRemaining: number
  ) => {
    const isUrgent = threshold === 90;
    const urgencyColor = isUrgent ? '#EF4444' : '#F59E0B';
    const urgencyBgStart = isUrgent ? '#FEE2E2' : '#FEF3C7';
    const urgencyBgEnd = isUrgent ? '#FECACA' : '#FDE68A';
    const urgencyText = isUrgent ? '#991B1B' : '#92400E';

    return {
      subject: isUrgent
        ? `⚠️ Only ${lessonsRemaining} Lessons Remaining! - Orbit Learn`
        : `📊 You've Used ${threshold}% of Your Monthly Lessons - Orbit Learn`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Usage Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, ${urgencyColor} 0%, #F59E0B 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">
          ${isUrgent ? '⚠️ Running Low on Lessons' : '📊 Usage Update'}
        </h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${parentName}! 👋
        </p>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          ${isUrgent
            ? `You only have <strong>${lessonsRemaining} lesson${lessonsRemaining === 1 ? '' : 's'}</strong> remaining this month!`
            : `You've used ${threshold}% of your monthly lesson allowance.`
          }
        </p>

        <!-- Usage Box -->
        <div style="background: linear-gradient(135deg, ${urgencyBgStart} 0%, ${urgencyBgEnd} 100%); border-radius: 16px; padding: 24px; margin: 28px 0; text-align: center;">
          <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 16px;">
            <div>
              <div style="font-size: 36px; font-weight: bold; color: ${urgencyText};">${lessonsUsed}</div>
              <div style="color: ${urgencyText}; font-size: 14px;">Used</div>
            </div>
            <div style="font-size: 36px; color: #ccc;">/</div>
            <div>
              <div style="font-size: 36px; font-weight: bold; color: ${urgencyText};">${lessonsLimit}</div>
              <div style="color: ${urgencyText}; font-size: 14px;">Monthly Limit</div>
            </div>
          </div>
          <div style="background: #e5e7eb; border-radius: 8px; height: 12px; overflow: hidden;">
            <div style="background: ${urgencyColor}; height: 100%; width: ${threshold}%; border-radius: 8px;"></div>
          </div>
          <p style="color: ${urgencyText}; margin: 12px 0 0 0; font-size: 14px; font-weight: 600;">
            ${lessonsRemaining} lesson${lessonsRemaining === 1 ? '' : 's'} remaining this month
          </p>
        </div>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          ${isUrgent
            ? "Don't let your child's learning momentum stop! Upgrade now to keep the lessons coming."
            : "Keep the learning momentum going! Consider upgrading for unlimited lessons."
          }
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/parent/billing" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Upgrade for Unlimited Lessons 🚀
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <span style="color: #a78bfa;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
${isUrgent ? 'Running Low on Lessons!' : 'Usage Update'}

Hi ${parentName},

${isUrgent
  ? `You only have ${lessonsRemaining} lesson${lessonsRemaining === 1 ? '' : 's'} remaining this month!`
  : `You've used ${threshold}% of your monthly lesson allowance.`
}

Usage: ${lessonsUsed} / ${lessonsLimit} lessons (${lessonsRemaining} remaining)

${isUrgent
  ? "Don't let your child's learning momentum stop! Upgrade now to keep the lessons coming."
  : "Keep the learning momentum going! Consider upgrading for unlimited lessons."
}

Upgrade at: ${config.frontendUrl}/parent/billing

- The Orbit Learn Team
      `,
    };
  },

  /**
   * Limit reached email (100%)
   */
  limitReached: (parentName: string, lessonsLimit: number) => ({
    subject: `🚫 Monthly Lesson Limit Reached - Orbit Learn`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson Limit Reached</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">
          Monthly Lesson Limit Reached
        </h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${parentName}! 👋
        </p>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          You've used all <strong>${lessonsLimit} lessons</strong> included in your free plan this month.
        </p>

        <!-- Limit Box -->
        <div style="background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%); border-radius: 16px; padding: 24px; margin: 28px 0; text-align: center; border: 2px solid #F87171;">
          <div style="font-size: 48px; margin-bottom: 8px;">🚫</div>
          <h3 style="color: #991B1B; margin: 0 0 8px 0; font-size: 20px;">No Lessons Remaining</h3>
          <p style="color: #B91C1C; margin: 0; font-size: 14px;">
            New lessons will be available on the 1st of next month
          </p>
        </div>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Don't let your child's learning stop! <strong>Upgrade to a Family plan</strong> for unlimited lessons and keep the momentum going.
        </p>

        <!-- Benefits Box -->
        <div style="background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%); border-radius: 16px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #5B21B6; margin: 0 0 12px 0; font-size: 16px;">✨ Family Plan Benefits:</h4>
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">📚 <strong>Unlimited lessons</strong> every month</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">👨‍👩‍👧 <strong>2 child profiles</strong> (add a sibling!)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">📊 <strong>Advanced analytics</strong> to track progress</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">💬 <strong>Priority support</strong> when you need help</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/parent/billing" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: bold; font-size: 17px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Upgrade Now - Start Free Trial 🚀
          </a>
          <p style="color: #6b7280; margin: 12px 0 0 0; font-size: 13px;">
            7-day free trial • Cancel anytime
          </p>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <span style="color: #a78bfa;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Monthly Lesson Limit Reached

Hi ${parentName},

You've used all ${lessonsLimit} lessons included in your free plan this month.

New lessons will be available on the 1st of next month.

Don't let your child's learning stop! Upgrade to a Family plan for unlimited lessons.

Family Plan Benefits:
- Unlimited lessons every month
- 2 child profiles (add a sibling!)
- Advanced analytics to track progress
- Priority support when you need help

Upgrade at: ${config.frontendUrl}/parent/billing
(7-day free trial • Cancel anytime)

- The Orbit Learn Team
    `,
  }),

  /**
   * Security alert email for sensitive account changes
   */
  securityAlert: (parentName: string, alertType: string, details: string) => ({
    subject: `🔒 Security Alert: ${alertType} - Orbit Learn`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header with Logo -->
    <tr>
      <td style="background: linear-gradient(135deg, #EF4444 0%, #F59E0B 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">🔒 Security Alert</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${parentName}! 👋
        </p>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          We're letting you know about a security-related change on your Orbit Learn account:
        </p>

        <!-- Alert Box -->
        <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 16px; padding: 24px; margin: 28px 0; border-left: 4px solid #F59E0B;">
          <h3 style="color: #92400E; margin: 0 0 12px 0; font-size: 18px;">${alertType}</h3>
          <p style="color: #78350F; margin: 0; font-size: 15px;">
            ${details}
          </p>
          <p style="color: #92400E; margin-top: 16px; margin-bottom: 0; font-size: 13px;">
            <strong>Time:</strong> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>

        <!-- Security Note -->
        <div style="background-color: #FEE2E2; border-radius: 12px; padding: 16px 20px; margin-top: 24px; border-left: 4px solid #EF4444;">
          <p style="color: #991B1B; margin: 0; font-size: 14px;">
            <strong>⚠️ Didn't make this change?</strong><br>
            If you didn't authorize this action, please secure your account immediately by changing your password and contacting our support team.
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/parent/settings" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Review Account Settings 🔐
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          This is an automated security notification. If you have any questions, please contact our support team.<br><br>
          <span style="color: #a78bfa;">- The Orbit Learn Security Team 🛡️</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Security Alert: ${alertType}

Hi ${parentName},

We're letting you know about a security-related change on your Orbit Learn account:

${alertType}
${details}

Time: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

Didn't make this change?
If you didn't authorize this action, please secure your account immediately by changing your password and contacting our support team.

Review your account settings at: ${config.frontendUrl}/parent/settings

- The Orbit Learn Security Team
    `,
  }),

  // =====================================================
  // TEACHER PORTAL EMAIL TEMPLATES
  // =====================================================

  /**
   * Teacher download purchase confirmation email
   */
  teacherDownloadPurchase: (
    teacherName: string,
    productType: 'PDF' | 'BUNDLE',
    contentTitle: string,
    amountPaid: string
  ) => {
    const isBundle = productType === 'BUNDLE';
    const productName = isBundle ? 'Full Lesson Bundle' : 'Lesson PDF';
    const includes = isBundle
      ? ['Lesson PDF', 'Quiz + Answer Key', 'Flashcards', 'Infographic', 'Google Slides', 'PowerPoint']
      : ['Lesson PDF'];

    return {
      subject: `✅ Purchase Confirmed: ${productName} - Orbit Learn`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">
          ✅ Purchase Confirmed!
        </h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <h2 style="color: #1E2A3A; margin-top: 0; font-size: 22px;">Hi ${teacherName}!</h2>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          Thank you for your purchase! Your download is now ready.
        </p>

        <!-- Purchase Details Box -->
        <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid #BBF7D0;">
          <h3 style="color: #166534; margin: 0 0 16px 0; font-size: 18px;">📦 Order Details</h3>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
            <tr>
              <td style="color: #3D4F66; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #D1FAE5;">Product:</td>
              <td style="color: #1E2A3A; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #D1FAE5; text-align: right; font-weight: 600;">${productName}</td>
            </tr>
            <tr>
              <td style="color: #3D4F66; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #D1FAE5;">Content:</td>
              <td style="color: #1E2A3A; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #D1FAE5; text-align: right; font-weight: 500;">${contentTitle}</td>
            </tr>
            <tr>
              <td style="color: #3D4F66; font-size: 14px; padding: 8px 0;">Amount Paid:</td>
              <td style="color: #166534; font-size: 16px; padding: 8px 0; text-align: right; font-weight: 700;">${amountPaid}</td>
            </tr>
          </table>
        </div>

        <!-- What's Included -->
        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #1E2A3A; margin: 0 0 12px 0; font-size: 15px;">📄 What's Included:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #3D4F66;">
            ${includes.map(item => `<li style="padding: 4px 0;">${item}</li>`).join('')}
          </ul>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/teacher/content"
             style="display: inline-block; background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(212,168,83,0.3);">
            Download Now →
          </a>
        </div>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 14px; text-align: center;">
          You can download your files anytime from your content library.
        </p>

        <!-- Footer -->
        <div style="border-top: 1px solid #E5E7EB; margin-top: 32px; padding-top: 24px; text-align: center;">
          <p style="color: #9CA3AF; font-size: 13px; margin: 0;">
            Questions? Reply to this email or contact us at support@orbitlearn.app
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Purchase Confirmed!

Hi ${teacherName},

Thank you for your purchase! Your download is now ready.

ORDER DETAILS
-------------
Product: ${productName}
Content: ${contentTitle}
Amount Paid: ${amountPaid}

What's Included:
${includes.map(item => `- ${item}`).join('\n')}

Download your files at: ${config.frontendUrl}/teacher/content

Questions? Contact us at support@orbitlearn.app

- The Orbit Learn Team
      `,
    };
  },

  /**
   * Teacher credit usage warning email (70% and 90% thresholds)
   */
  teacherCreditWarning: (
    teacherName: string,
    threshold: 70 | 90,
    creditsUsed: number,
    creditsTotal: number,
    creditsRemaining: number,
    tier: string
  ) => {
    const isUrgent = threshold === 90;
    const urgencyColor = isUrgent ? '#EF4444' : '#F59E0B';
    const urgencyBgStart = isUrgent ? '#FEE2E2' : '#FEF3C7';
    const urgencyBgEnd = isUrgent ? '#FECACA' : '#FDE68A';
    const urgencyText = isUrgent ? '#991B1B' : '#92400E';

    return {
      subject: isUrgent
        ? `⚠️ Only ${creditsRemaining} Credits Remaining! - Orbit Learn for Teachers`
        : `📊 You've Used ${threshold}% of Your Monthly Credits - Orbit Learn for Teachers`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credit Usage Warning</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, ${urgencyColor} 0%, ${isUrgent ? '#F87171' : '#FBBF24'} 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">
          ${isUrgent ? '⚠️ Credits Running Low!' : '📊 Credit Usage Update'}
        </h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${teacherName}! 👋
        </p>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          ${isUrgent
            ? `You've used <strong>${threshold}%</strong> of your monthly credits. You only have <strong>${creditsRemaining} credits</strong> remaining.`
            : `You've used <strong>${threshold}%</strong> of your monthly credits. Keep creating great content!`
          }
        </p>

        <!-- Usage Progress Box -->
        <div style="background: linear-gradient(135deg, ${urgencyBgStart} 0%, ${urgencyBgEnd} 100%); border-radius: 16px; padding: 24px; margin: 28px 0; border-left: 4px solid ${urgencyColor};">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: ${urgencyText}; font-weight: 600;">Credits Used</span>
            <span style="color: ${urgencyText}; font-weight: 700;">${creditsUsed} / ${creditsTotal}</span>
          </div>
          <div style="background-color: #ffffff; border-radius: 8px; height: 12px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, ${urgencyColor} 0%, ${isUrgent ? '#F87171' : '#FBBF24'} 100%); height: 100%; width: ${threshold}%; border-radius: 8px;"></div>
          </div>
          <p style="color: ${urgencyText}; margin: 12px 0 0 0; font-size: 14px; text-align: center;">
            <strong>${creditsRemaining} credits</strong> remaining this month
          </p>
        </div>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          ${isUrgent
            ? `Don't let your workflow stop! Purchase a credit pack or upgrade your plan to keep creating.`
            : `Need more credits? Upgrade your plan or purchase a credit pack anytime.`
          }
        </p>

        <!-- Current Plan Info -->
        <div style="background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%); border-radius: 16px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #5B21B6; margin: 0 0 12px 0; font-size: 16px;">📋 Your Current Plan: ${tier}</h4>
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">💳 <strong>${creditsTotal} credits</strong> per month</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">📦 <strong>Credit packs</strong> available for purchase</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">🔄 <strong>Unused credits</strong> roll over (up to ${creditsTotal * 2})</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}${isUrgent ? '/teacher/billing' : '/teacher/usage'}" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: bold; font-size: 17px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            ${isUrgent ? 'Get More Credits Now 🚀' : 'View Usage Details 📊'}
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <span style="color: #a78bfa;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Credit Usage Warning

Hi ${teacherName},

${isUrgent
  ? `You've used ${threshold}% of your monthly credits. You only have ${creditsRemaining} credits remaining.`
  : `You've used ${threshold}% of your monthly credits. Keep creating great content!`
}

Usage: ${creditsUsed} / ${creditsTotal} credits (${creditsRemaining} remaining)

${isUrgent
  ? "Don't let your workflow stop! Purchase a credit pack or upgrade your plan to keep creating."
  : "Need more credits? Upgrade your plan or purchase a credit pack anytime."
}

${isUrgent
  ? `Get more credits at: ${config.frontendUrl}/teacher/billing`
  : `View your usage details at: ${config.frontendUrl}/teacher/usage`
}

- The Orbit Learn Team
      `,
    };
  },

  /**
   * Teacher credit limit reached email (100%)
   */
  teacherCreditLimitReached: (
    teacherName: string,
    creditsTotal: number,
    tier: string
  ) => ({
    subject: `🚫 Monthly Credit Limit Reached - Orbit Learn for Teachers`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credit Limit Reached</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">
          Monthly Credit Limit Reached
        </h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${teacherName}! 👋
        </p>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          You've used all <strong>${creditsTotal} credits</strong> included in your ${tier} plan this month.
        </p>

        <!-- Limit Box -->
        <div style="background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%); border-radius: 16px; padding: 24px; margin: 28px 0; text-align: center; border: 2px solid #F87171;">
          <div style="font-size: 48px; margin-bottom: 8px;">🚫</div>
          <h3 style="color: #991B1B; margin: 0 0 8px 0; font-size: 20px;">No Credits Remaining</h3>
          <p style="color: #B91C1C; margin: 0; font-size: 14px;">
            Your credits will reset on the 1st of next month
          </p>
        </div>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Don't let your productivity stop! <strong>Purchase a credit pack</strong> to continue creating content immediately, or <strong>upgrade your plan</strong> for more monthly credits.
        </p>

        <!-- Options Box -->
        <div style="background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%); border-radius: 16px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #5B21B6; margin: 0 0 12px 0; font-size: 16px;">💡 Your Options:</h4>
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">📦 <strong>Credit Pack</strong> - 100 credits for $4.99 (instant)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">⭐ <strong>Upgrade to Basic</strong> - 500 credits/month for $9.99</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">🚀 <strong>Upgrade to Pro</strong> - 2,000 credits/month for $24.99</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #4b5563; font-size: 14px;">⏰ <strong>Wait</strong> - Credits reset on the 1st of next month</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/teacher/billing" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: bold; font-size: 17px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Get More Credits Now 🚀
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <span style="color: #a78bfa;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Monthly Credit Limit Reached

Hi ${teacherName},

You've used all ${creditsTotal} credits included in your ${tier} plan this month.

Your credits will reset on the 1st of next month.

Don't let your productivity stop! Purchase a credit pack to continue creating content immediately, or upgrade your plan for more monthly credits.

Your Options:
- Credit Pack - 100 credits for $4.99 (instant)
- Upgrade to Basic - 500 credits/month for $9.99
- Upgrade to Pro - 2,000 credits/month for $24.99
- Wait - Credits reset on the 1st of next month

Manage your billing at: ${config.frontendUrl}/teacher/billing

- The Orbit Learn Team
    `,
  }),

  /**
   * Export ready notification email
   */
  exportReady: (
    teacherName: string,
    contentTitle: string,
    formatName: string,
    downloadUrl: string,
    fileSize: string
  ) => ({
    subject: `Your ${formatName} is Ready! - ${contentTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Export Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #10B981 0%, #2DD4BF 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">
          Your ${formatName} is Ready!
        </h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Hi ${teacherName}! 👋
        </p>

        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Great news! Your <strong>${formatName}</strong> export is ready for download.
        </p>

        <!-- File Info Box -->
        <div style="background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%); border-radius: 16px; padding: 24px; margin: 28px 0; text-align: center; border: 2px solid #34D399;">
          <div style="font-size: 48px; margin-bottom: 8px;">${formatName === 'PowerPoint' ? '📊' : '📄'}</div>
          <h3 style="color: #047857; margin: 0 0 8px 0; font-size: 18px;">${contentTitle}</h3>
          <p style="color: #059669; margin: 0; font-size: 14px;">
            ${formatName} • ${fileSize}
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${downloadUrl}" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: bold; font-size: 17px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Download ${formatName} ⬇️
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          You can also find this file in your <a href="${config.frontendUrl}/teacher/downloads" style="color: #7C3AED;">Downloads</a> section.
        </p>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <span style="color: #a78bfa;">- The Orbit Learn Team 💜</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Your ${formatName} is Ready!

Hi ${teacherName},

Great news! Your ${formatName} export is ready for download.

File: ${contentTitle}
Format: ${formatName}
Size: ${fileSize}

Download your file: ${downloadUrl}

You can also find this file in your Downloads section at: ${config.frontendUrl}/teacher/downloads

- The Orbit Learn Team
    `,
  }),

  /**
   * Weekly Prep Digest — sent when a scheduled weekly prep is ready for review
   */
  weeklyPrepDigest: (
    teacherName: string,
    weekLabel: string,
    materialCount: number,
    dayBreakdown: Record<string, number>,
    reviewUrl: string
  ) => {
    const dayRows = Object.entries(dayBreakdown)
      .map(
        ([day, count]) =>
          `<tr><td style="padding: 8px 16px; color: #4b5563; font-size: 15px; border-bottom: 1px solid #f3f4f6;">${day}</td><td style="padding: 8px 16px; color: #5B21B6; font-weight: 600; font-size: 15px; text-align: right; border-bottom: 1px solid #f3f4f6;">${count} materials</td></tr>`
      )
      .join('');

    const dayText = Object.entries(dayBreakdown)
      .map(([day, count]) => `  ${day}: ${count} materials`)
      .join('\n');

    return {
      subject: `Your weekly prep is ready — ${weekLabel}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Prep Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Your Weekly Prep is Ready!</h1>
        <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 16px;">${weekLabel}</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 36px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <h2 style="color: #1e1b4b; margin-top: 0; font-size: 20px;">Hi ${teacherName}!</h2>
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px;">
          Your AI assistant has finished generating <strong>${materialCount} materials</strong> for the week. Here's the breakdown:
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #F9FAFB; border-radius: 12px; overflow: hidden; margin: 24px 0;">
          <tr style="background: #EDE9FE;">
            <td style="padding: 10px 16px; color: #5B21B6; font-weight: 600; font-size: 14px;">Day</td>
            <td style="padding: 10px 16px; color: #5B21B6; font-weight: 600; font-size: 14px; text-align: right;">Materials</td>
          </tr>
          ${dayRows}
        </table>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${reviewUrl}" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Review & Approve
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-bottom: 0; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          You received this because you set up weekly prep scheduling.<br>
          <span style="color: #a78bfa;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Your Weekly Prep is Ready — ${weekLabel}

Hi ${teacherName}!

Your AI assistant has finished generating ${materialCount} materials for the week.

Day-by-day breakdown:
${dayText}

Review & approve your materials at: ${reviewUrl}

— The Orbit Learn Team
      `,
    };
  },
};

export const emailService = {
  /**
   * Send welcome email to new parent
   */
  async sendWelcomeEmail(email: string, parentName: string): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped welcome email to ${email}`);
      return true;
    }

    try {
      const template = templates.welcome(parentName);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send welcome email', { error, email });
        return false;
      }

      logger.info(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending welcome email', { error, email });
      return false;
    }
  },

  /**
   * Send OTP verification email
   */
  async sendOtpEmail(
    email: string,
    otp: string,
    purpose: 'verify_email' | 'reset_password' | 'login'
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped OTP email to ${email}, code: ${otp}`);
      return true;
    }

    try {
      const template = templates.otp(otp, purpose);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send OTP email', { error, email, purpose });
        return false;
      }

      logger.info(`OTP email sent to ${email} for ${purpose}`);
      return true;
    } catch (error) {
      logger.error('Error sending OTP email', { error, email });
      return false;
    }
  },

  /**
   * Send child profile created notification
   */
  async sendChildAddedEmail(
    email: string,
    parentName: string,
    childName: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped child added email to ${email}`);
      return true;
    }

    try {
      const template = templates.childAdded(parentName, childName);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send child added email', { error, email });
        return false;
      }

      logger.info(`Child added email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending child added email', { error, email });
      return false;
    }
  },

  /**
   * Send weekly progress report
   */
  async sendWeeklyProgressEmail(
    email: string,
    parentName: string,
    childName: string,
    stats: {
      lessonsCompleted: number;
      timeSpent: string;
      xpEarned: number;
      streak: number;
      badgesEarned: string[];
    }
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped weekly progress email to ${email}`);
      return true;
    }

    try {
      const template = templates.weeklyProgress(parentName, childName, stats);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send weekly progress email', { error, email });
        return false;
      }

      logger.info(`Weekly progress email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending weekly progress email', { error, email });
      return false;
    }
  },

  /**
   * Send security alert for sensitive account changes
   */
  async sendSecurityAlert(
    email: string,
    parentName: string,
    alertType: string,
    details: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped security alert to ${email}: ${alertType}`);
      return true;
    }

    try {
      const template = templates.securityAlert(parentName, alertType, details);

      const { error } = await resend.emails.send({
        from: `Orbit Learn Security <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send security alert email', { error, email, alertType });
        return false;
      }

      logger.info(`Security alert email sent to ${email}: ${alertType}`);
      return true;
    } catch (error) {
      logger.error('Error sending security alert email', { error, email });
      return false;
    }
  },

  /**
   * Send welcome email to new teacher (green themed)
   */
  async sendTeacherWelcomeEmail(email: string, teacherName: string): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher welcome email to ${email}`);
      return true;
    }

    try {
      const template = templates.teacherWelcome(teacherName);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher welcome email', { error, email });
        return false;
      }

      logger.info(`Teacher welcome email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending teacher welcome email', { error, email });
      return false;
    }
  },

  /**
   * Send trial welcome email to new teacher (7-day unlimited trial)
   */
  async sendTeacherTrialWelcomeEmail(
    email: string,
    teacherName: string,
    trialEndsAt: Date | null
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher trial welcome email to ${email}`);
      return true;
    }

    try {
      const trialEndDateText = trialEndsAt
        ? trialEndsAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'in 7 days';
      const template = templates.teacherTrialWelcome(teacherName, trialEndDateText);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher trial welcome email', { error, email });
        return false;
      }

      logger.info(`Teacher trial welcome email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending teacher trial welcome email', { error, email });
      return false;
    }
  },

  /**
   * Send trial expiring email (24 hours remaining)
   */
  async sendTeacherTrialExpiringEmail(
    email: string,
    teacherName: string,
    trialEndsAt: Date | null
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher trial expiring email to ${email}`);
      return true;
    }

    try {
      const trialEndDateText = trialEndsAt
        ? trialEndsAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'tomorrow';
      const template = templates.teacherTrialExpiring(teacherName, trialEndDateText);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher trial expiring email', { error, email });
        return false;
      }

      logger.info(`Teacher trial expiring email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending teacher trial expiring email', { error, email });
      return false;
    }
  },

  /**
   * Send trial expired email
   */
  async sendTeacherTrialExpiredEmail(email: string, teacherName: string): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher trial expired email to ${email}`);
      return true;
    }

    try {
      const template = templates.teacherTrialExpired(teacherName);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher trial expired email', { error, email });
        return false;
      }

      logger.info(`Teacher trial expired email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending teacher trial expired email', { error, email });
      return false;
    }
  },

  /**
   * Send OTP verification email to teacher (green themed)
   */
  async sendTeacherOtpEmail(
    email: string,
    otp: string,
    purpose: 'verify_email' | 'reset_password' | 'login'
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher OTP email to ${email}, code: ${otp}`);
      return true;
    }

    try {
      const template = templates.teacherOtp(otp, purpose);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher OTP email', { error, email, purpose });
        return false;
      }

      logger.info(`Teacher OTP email sent to ${email} for ${purpose}`);
      return true;
    } catch (error) {
      logger.error('Error sending teacher OTP email', { error, email });
      return false;
    }
  },

  /**
   * Send verification link email to teacher (click-to-verify, lower friction than OTP)
   */
  async sendTeacherVerificationLinkEmail(
    email: string,
    teacherName: string,
    verificationUrl: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher verification link email to ${email}, url: ${verificationUrl}`);
      return true;
    }

    try {
      const template = templates.teacherVerificationLink(teacherName, verificationUrl);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher verification link email', { error, email });
        return false;
      }

      logger.info(`Teacher verification link email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending teacher verification link email', { error, email });
      return false;
    }
  },

  /**
   * Send usage warning email (70% or 90% threshold)
   */
  async sendUsageWarningEmail(
    email: string,
    parentName: string,
    threshold: 70 | 90,
    lessonsUsed: number,
    lessonsLimit: number,
    lessonsRemaining: number
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped usage warning (${threshold}%) email to ${email}`);
      return true;
    }

    try {
      const template = templates.usageWarning(
        parentName,
        threshold,
        lessonsUsed,
        lessonsLimit,
        lessonsRemaining
      );

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send usage warning email', { error, email, threshold });
        return false;
      }

      logger.info(`Usage warning (${threshold}%) email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending usage warning email', { error, email });
      return false;
    }
  },

  /**
   * Send limit reached email (100%)
   */
  async sendLimitReachedEmail(
    email: string,
    parentName: string,
    lessonsLimit: number
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped limit reached email to ${email}`);
      return true;
    }

    try {
      const template = templates.limitReached(parentName, lessonsLimit);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send limit reached email', { error, email });
        return false;
      }

      logger.info(`Limit reached email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending limit reached email', { error, email });
      return false;
    }
  },

  /**
   * Send subscription renewal email to parent
   */
  async sendParentSubscriptionRenewalEmail(
    email: string,
    parentName: string,
    planName: string,
    amountPaid: string,
    nextBillingDate: string,
    receiptUrl?: string | null,
    invoiceNumber?: string | null
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped parent subscription renewal email to ${email}`);
      return true;
    }

    try {
      const template = templates.subscriptionRenewalParent(
        parentName,
        planName,
        amountPaid,
        nextBillingDate,
        receiptUrl,
        invoiceNumber
      );

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send parent subscription renewal email', { error, email });
        return false;
      }

      logger.info(`Parent subscription renewal email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending parent subscription renewal email', { error, email });
      return false;
    }
  },

  // =====================================================
  // TEACHER PORTAL EMAIL METHODS
  // =====================================================

  /**
   * Send teacher credit usage warning email (70% or 90% threshold)
   */
  async sendTeacherCreditWarningEmail(
    email: string,
    teacherName: string,
    threshold: 70 | 90,
    creditsUsed: number,
    creditsTotal: number,
    creditsRemaining: number,
    tier: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher credit warning (${threshold}%) email to ${email}`);
      return true;
    }

    try {
      const template = templates.teacherCreditWarning(
        teacherName,
        threshold,
        creditsUsed,
        creditsTotal,
        creditsRemaining,
        tier
      );

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher credit warning email', { error, email, threshold });
        return false;
      }

      logger.info(`Teacher credit warning (${threshold}%) email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending teacher credit warning email', { error, email });
      return false;
    }
  },

  /**
   * Send teacher credit limit reached email (100%)
   */
  async sendTeacherCreditLimitReachedEmail(
    email: string,
    teacherName: string,
    creditsTotal: number,
    tier: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher credit limit reached email to ${email}`);
      return true;
    }

    try {
      const template = templates.teacherCreditLimitReached(teacherName, creditsTotal, tier);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher credit limit reached email', { error, email });
        return false;
      }

      logger.info(`Teacher credit limit reached email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending teacher credit limit reached email', { error, email });
      return false;
    }
  },

  /**
   * Send subscription renewal email to teacher
   */
  async sendTeacherSubscriptionRenewalEmail(
    email: string,
    teacherName: string,
    planName: string,
    amountPaid: string,
    nextBillingDate: string,
    receiptUrl?: string | null,
    invoiceNumber?: string | null
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher subscription renewal email to ${email}`);
      return true;
    }

    try {
      const template = templates.subscriptionRenewalTeacher(
        teacherName,
        planName,
        amountPaid,
        nextBillingDate,
        receiptUrl,
        invoiceNumber
      );

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher subscription renewal email', { error, email });
        return false;
      }

      logger.info(`Teacher subscription renewal email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending teacher subscription renewal email', { error, email });
      return false;
    }
  },

  /**
   * Send suggestion/feedback email to support
   */
  async sendSuggestionEmail(
    message: string,
    userEmail: string | null,
    portal: 'student' | 'teacher',
    metadata?: {
      userId?: string;
      userType?: string;
      page?: string;
      browser?: string;
    }
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped suggestion email from ${portal} portal`);
      return true;
    }

    try {
      const portalLabel = portal === 'teacher' ? 'Teacher Portal' : 'Student Portal';
      const portalColor = portal === 'teacher' ? '#059669' : '#7C3AED';
      const timestamp = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'America/New_York',
      });

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Suggestion from ${portalLabel}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, ${portalColor} 0%, #2DD4BF 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">
          📬 New Suggestion Received
        </h1>
        <p style="color: rgba(255,255,255,0.95); margin-top: 8px; font-size: 16px;">
          From ${portalLabel}
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

        <!-- Suggestion Message -->
        <div style="background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%); border-radius: 16px; padding: 24px; margin-bottom: 24px; border-left: 4px solid ${portalColor};">
          <h3 style="color: #1F2937; margin: 0 0 12px 0; font-size: 16px;">💬 Message:</h3>
          <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
        </div>

        <!-- Reply Email -->
        ${userEmail ? `
        <div style="background-color: #ECFDF5; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="color: #065F46; margin: 0; font-size: 14px;">
            <strong>📧 Reply to:</strong> <a href="mailto:${userEmail}" style="color: #059669;">${userEmail}</a>
          </p>
        </div>
        ` : `
        <div style="background-color: #FEF3C7; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="color: #92400E; margin: 0; font-size: 14px;">
            <strong>📧 Reply email:</strong> Not provided
          </p>
        </div>
        `}

        <!-- Metadata -->
        <div style="background-color: #F9FAFB; border-radius: 12px; padding: 20px; border: 1px solid #E5E7EB;">
          <h4 style="color: #6B7280; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">📊 Details</h4>
          <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%;">
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-size: 14px; width: 120px;">Portal:</td>
              <td style="padding: 6px 0; color: #374151; font-size: 14px; font-weight: 500;">${portalLabel}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-size: 14px;">User ID:</td>
              <td style="padding: 6px 0; color: #374151; font-size: 14px; font-weight: 500;">${metadata?.userId || 'Anonymous'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-size: 14px;">User Type:</td>
              <td style="padding: 6px 0; color: #374151; font-size: 14px; font-weight: 500;">${metadata?.userType || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Page:</td>
              <td style="padding: 6px 0; color: #374151; font-size: 14px; font-weight: 500;">${metadata?.page || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Browser:</td>
              <td style="padding: 6px 0; color: #374151; font-size: 14px; font-weight: 500;">${metadata?.browser || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Timestamp:</td>
              <td style="padding: 6px 0; color: #374151; font-size: 14px; font-weight: 500;">${timestamp}</td>
            </tr>
          </table>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          This suggestion was submitted via the Orbit Learn suggestion box.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      const text = `
New Suggestion from ${portalLabel}

Message:
${message}

Reply Email: ${userEmail || 'Not provided'}

Details:
- Portal: ${portalLabel}
- User ID: ${metadata?.userId || 'Anonymous'}
- User Type: ${metadata?.userType || 'Unknown'}
- Page: ${metadata?.page || 'Unknown'}
- Browser: ${metadata?.browser || 'Unknown'}
- Timestamp: ${timestamp}
      `;

      const { error } = await resend.emails.send({
        from: `Orbit Learn Suggestions <${config.email.fromEmail}>`,
        to: 'support@orbitlearn.app',
        replyTo: userEmail || undefined,
        subject: `[${portal.toUpperCase()}] New Suggestion - Orbit Learn`,
        html,
        text,
      });

      if (error) {
        logger.error('Failed to send suggestion email', { error, portal });
        return false;
      }

      logger.info(`Suggestion email sent from ${portal} portal`);
      return true;
    } catch (error) {
      logger.error('Error sending suggestion email', { error, portal });
      return false;
    }
  },

  /**
   * Send export ready email to teacher
   */
  async sendExportReadyEmail(
    email: string,
    teacherName: string,
    contentTitle: string,
    formatName: string,
    downloadUrl: string,
    fileSize: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped export ready email to ${email}`);
      return true;
    }

    try {
      const template = templates.exportReady(
        teacherName,
        contentTitle,
        formatName,
        downloadUrl,
        fileSize
      );

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send export ready email', { error, email });
        return false;
      }

      logger.info(`Export ready email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error('Error sending export ready email', { error, email });
      return false;
    }
  },

  /**
   * Send teacher download purchase confirmation email
   */
  async sendTeacherDownloadPurchaseEmail(
    email: string,
    teacherName: string,
    productType: 'PDF' | 'BUNDLE',
    contentTitle: string,
    amountCents: number
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped teacher download purchase email to ${email}`);
      return true;
    }

    try {
      const amountPaid = `$${(amountCents / 100).toFixed(2)}`;
      const template = templates.teacherDownloadPurchase(
        teacherName,
        productType,
        contentTitle,
        amountPaid
      );

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send teacher download purchase email', { error, email });
        return false;
      }

      logger.info(`Teacher download purchase email sent to ${email}`, { productType, contentTitle });
      return true;
    } catch (error) {
      logger.error('Error sending teacher download purchase email', { error, email });
      return false;
    }
  },

  /**
   * Send weekly prep digest email when scheduled prep is ready
   */
  async sendWeeklyPrepDigestEmail(
    email: string,
    teacherName: string,
    weekLabel: string,
    materialCount: number,
    dayBreakdown: Record<string, number>,
    reviewUrl: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped weekly prep digest email to ${email}`);
      return true;
    }

    try {
      const template = templates.weeklyPrepDigest(
        teacherName,
        weekLabel,
        materialCount,
        dayBreakdown,
        reviewUrl
      );

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send weekly prep digest email', { error, email });
        return false;
      }

      logger.info(`Weekly prep digest email sent to ${email}`, { weekLabel, materialCount });
      return true;
    } catch (error) {
      logger.error('Error sending weekly prep digest email', { error, email });
      return false;
    }
  },
};
