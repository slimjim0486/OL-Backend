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
    subject: 'Welcome to Orbit Learn — Meet Ollie, the AI That Learns How You Teach',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Orbit Learn</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 48px 40px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 18px; margin-bottom: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; font-family: 'Fraunces', Georgia, serif; line-height: 1.3;">Meet Ollie</h1>
        <p style="color: rgba(255,255,255,0.92); margin: 8px 0 0 0; font-size: 16px; line-height: 1.5;">The AI teaching assistant that learns <em>you</em></p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <h2 style="color: #1E2A3A; margin: 0 0 20px 0; font-size: 22px; font-family: 'Fraunces', Georgia, serif;">Hi ${teacherName},</h2>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px; margin: 0 0 24px 0;">
          Welcome to Orbit Learn. We didn't build another content generator. We built <strong>Ollie</strong> — an AI teaching assistant that remembers your classroom, learns your teaching style, and gets better every time you work together.
        </p>

        <!-- What Makes Ollie Different -->
        <div style="background: linear-gradient(135deg, #FAF7F2 0%, #FDF8F3 100%); border-radius: 12px; padding: 28px; margin: 0 0 28px 0; border: 1px solid rgba(45,90,74,0.1);">
          <h3 style="color: #2D5A4A; margin: 0 0 16px 0; font-size: 18px; font-family: 'Fraunces', Georgia, serif;">Ollie isn't just a tool. Ollie is your partner.</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; vertical-align: top; width: 28px; color: #2D5A4A; font-size: 18px;">&#10003;</td>
              <td style="padding: 8px 0 8px 8px; color: #3D4F66; font-size: 15px; line-height: 1.5;"><strong>Remembers your students</strong> — groups, levels, IEPs, the whole picture</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; vertical-align: top; width: 28px; color: #2D5A4A; font-size: 18px;">&#10003;</td>
              <td style="padding: 8px 0 8px 8px; color: #3D4F66; font-size: 15px; line-height: 1.5;"><strong>Learns your style</strong> — every edit teaches Ollie what you prefer</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; vertical-align: top; width: 28px; color: #2D5A4A; font-size: 18px;">&#10003;</td>
              <td style="padding: 8px 0 8px 8px; color: #3D4F66; font-size: 15px; line-height: 1.5;"><strong>Tracks your standards</strong> — knows what you've covered and what's left</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; vertical-align: top; width: 28px; color: #2D5A4A; font-size: 18px;">&#10003;</td>
              <td style="padding: 8px 0 8px 8px; color: #3D4F66; font-size: 15px; line-height: 1.5;"><strong>Creates anything</strong> — lessons, quizzes, sub plans, IEP goals, parent emails, and more</td>
            </tr>
          </table>
        </div>

        <!-- Getting Started Steps -->
        <h3 style="color: #1E2A3A; font-size: 17px; font-family: 'Fraunces', Georgia, serif; margin: 0 0 16px 0;">Get started in under 5 minutes:</h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 32px 0;">
          <tr>
            <td style="padding: 10px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: #2D5A4A; color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 15px; vertical-align: middle; line-height: 32px;">1</td>
                  <td style="padding-left: 16px; color: #3D4F66; font-size: 15px; line-height: 1.5;"><strong>Tell Ollie about your classroom</strong><br><span style="color: #9CA3AF; font-size: 13px;">Grades, subjects, student groups — a quick chat is all it takes</span></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: #3D7A6A; color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 15px; vertical-align: middle; line-height: 32px;">2</td>
                  <td style="padding-left: 16px; color: #3D4F66; font-size: 15px; line-height: 1.5;"><strong>Ask Ollie to create something</strong><br><span style="color: #9CA3AF; font-size: 13px;">A lesson, a quiz, flashcards — just say what you need</span></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: #D4A853; color: #1E2A3A; width: 32px; height: 32px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 15px; vertical-align: middle; line-height: 32px;">3</td>
                  <td style="padding-left: 16px; color: #3D4F66; font-size: 15px; line-height: 1.5;"><strong>Watch Ollie get smarter</strong><br><span style="color: #9CA3AF; font-size: 13px;">Approve, edit, or regenerate — Ollie learns from every interaction</span></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <div style="text-align: center; margin: 0 0 32px 0;">
          <a href="${config.frontendUrl}/teacher/agent/chat" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 16px 44px; border-radius: 16px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            Start Chatting with Ollie
          </a>
        </div>

        <!-- Social Proof -->
        <div style="background: #F0FAF5; border-radius: 10px; padding: 20px; margin: 0 0 28px 0; text-align: center;">
          <p style="color: #2D5A4A; margin: 0; font-size: 14px; font-style: italic; line-height: 1.6;">
            "I used to spend my Sundays planning. Now I tell Ollie what I need and spend that time with my family."
          </p>
          <p style="color: #9CA3AF; margin: 8px 0 0 0; font-size: 13px;">— 3rd Grade Teacher, Texas</p>
        </div>

        <!-- Footer -->
        <p style="color: #9CA3AF; font-size: 14px; border-top: 1px solid #E5E7EB; padding-top: 24px; margin: 0; text-align: center; line-height: 1.6;">
          Questions? Just reply to this email — a real person will get back to you.<br>
          <span style="color: #3D4F66; font-weight: 500;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Welcome to Orbit Learn

Hi ${teacherName},

Welcome to Orbit Learn. We didn't build another content generator. We built Ollie — an AI teaching assistant that remembers your classroom, learns your teaching style, and gets better every time you work together.

OLLIE ISN'T JUST A TOOL. OLLIE IS YOUR PARTNER.

- Remembers your students — groups, levels, IEPs, the whole picture
- Learns your style — every edit teaches Ollie what you prefer
- Tracks your standards — knows what you've covered and what's left
- Creates anything — lessons, quizzes, sub plans, IEP goals, parent emails, and more

GET STARTED IN UNDER 5 MINUTES:

1. Tell Ollie about your classroom — Grades, subjects, student groups — a quick chat is all it takes
2. Ask Ollie to create something — A lesson, a quiz, flashcards — just say what you need
3. Watch Ollie get smarter — Approve, edit, or regenerate — Ollie learns from every interaction

Start chatting with Ollie: ${config.frontendUrl}/teacher/agent/chat

"I used to spend my Sundays planning. Now I tell Ollie what I need and spend that time with my family." — 3rd Grade Teacher, Texas

Questions? Just reply to this email — a real person will get back to you.
— The Orbit Learn Team
    `,
  }),

  /**
   * Teacher trial welcome email (7-day unlimited trial)
   */
  teacherTrialWelcome: (teacherName: string, trialEndDateText: string) => ({
    subject: 'Your 7-Day Pro Trial Starts Now — Orbit Learn',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Pro Trial Starts Now</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 36px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 96px; height: 96px; border-radius: 18px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">Your 7-Day Pro Trial Starts Now</h1>
        <p style="color: rgba(255,255,255,0.92); margin-top: 8px; font-size: 16px;">Unlock everything Ollie can do</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 36px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <h2 style="color: #1E2A3A; margin-top: 0; font-size: 22px; font-family: 'Fraunces', Georgia, serif;">Hi ${teacherName},</h2>
        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          Welcome to Orbit Learn! For the next 7 days, you have full access to <strong>Ollie</strong>, your AI teaching assistant, plus every Pro feature.
        </p>

        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #D4A853;">
          <p style="color: #1E2A3A; margin: 0; font-size: 15px;">
            Your trial ends on <strong>${trialEndDateText}</strong>.
          </p>
        </div>

        <h3 style="color: #1E2A3A; font-size: 16px; margin-bottom: 12px; font-family: 'Fraunces', Georgia, serif;">What's included in Pro:</h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px 0;">
          <tr>
            <td style="padding: 8px 0; color: #3D4F66; font-size: 15px; line-height: 1.6;">Weekly lesson prep with differentiated materials</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #3D4F66; font-size: 15px; line-height: 1.6;">AI-assisted grading and rubric builder</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #3D4F66; font-size: 15px; line-height: 1.6;">Audio updates for parents</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #3D4F66; font-size: 15px; line-height: 1.6;">Standards coverage tracking and gap analysis</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #3D4F66; font-size: 15px; line-height: 1.6;">Monthly and yearly review summaries</td>
          </tr>
        </table>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px;">
          After your trial, free generation continues — you only pay when downloading or exporting. Or upgrade to Pro to keep all features.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${config.frontendUrl}/teacher/agent/chat" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 14px 36px; border-radius: 16px; font-weight: 700; font-size: 15px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            Start with Ollie
          </a>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 18px; margin: 0;">
          Questions? Reply to this email — we're here to help.<br>
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Your 7-Day Pro Trial Starts Now

Hi ${teacherName},

Welcome to Orbit Learn! For the next 7 days, you have full access to Ollie, your AI teaching assistant, plus every Pro feature.

Your trial ends on ${trialEndDateText}.

What's included in Pro:
- Weekly lesson prep with differentiated materials
- AI-assisted grading and rubric builder
- Audio updates for parents
- Standards coverage tracking and gap analysis
- Monthly and yearly review summaries

After your trial, free generation continues — you only pay when downloading or exporting. Or upgrade to Pro to keep all features.

Start with Ollie: ${config.frontendUrl}/teacher/agent/chat

— The Orbit Learn Team
    `,
  }),

  /**
   * Teacher trial expiring email (24 hours remaining)
   */
  teacherTrialExpiring: (teacherName: string, trialEndDateText: string) => ({
    subject: 'Your Pro trial ends tomorrow — Orbit Learn',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trial Ending Soon</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #C75B39 0%, #E07B6B 100%); border-radius: 16px 16px 0 0; padding: 28px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: 'Fraunces', Georgia, serif;">Your Pro trial ends tomorrow</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 28px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <p style="color: #3D4F66; font-size: 16px; line-height: 1.7; margin-top: 0;">
          Hi ${teacherName}, your 7-day Pro trial ends <strong>tomorrow (${trialEndDateText})</strong>.
        </p>
        <p style="color: #3D4F66; font-size: 15px; line-height: 1.7;">
          Ollie is ready to keep planning your week, tracking your standards, and generating materials. Upgrade to Pro to keep all features unlocked.
        </p>
        <div style="background: #FAF7F2; border-radius: 12px; padding: 16px 20px; margin: 20px 0; border-left: 4px solid #C75B39;">
          <p style="color: #1E2A3A; margin: 0; font-size: 14px;">
            After your trial, free content generation continues — you only pay when exporting. Pro adds weekly prep, AI grading, audio updates, and more.
          </p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${config.frontendUrl}/teacher/billing" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 14px 32px; border-radius: 16px; font-weight: 700; font-size: 15px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            Upgrade to Pro
          </a>
        </div>
        <p style="color: #9CA3AF; font-size: 13px; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 16px; margin: 0;">
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Hi ${teacherName},

Your 7-day Pro trial ends tomorrow (${trialEndDateText}).

Ollie is ready to keep planning your week, tracking your standards, and generating materials. Upgrade to Pro to keep all features unlocked.

After your trial, free content generation continues — you only pay when exporting. Pro adds weekly prep, AI grading, audio updates, and more.

Upgrade to Pro: ${config.frontendUrl}/teacher/billing

— The Orbit Learn Team
    `,
  }),

  /**
   * Teacher trial expired email
   */
  teacherTrialExpired: (teacherName: string) => ({
    subject: 'Your Pro trial has ended — here is what stays',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trial Ended</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 26px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: 'Fraunces', Georgia, serif;">Your Pro trial has ended</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 28px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <p style="color: #3D4F66; font-size: 16px; line-height: 1.7; margin-top: 0;">
          Hi ${teacherName}, your 7-day Pro trial has ended, but Ollie is still here.
        </p>

        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #7BAE7F;">
          <h4 style="color: #1E2A3A; margin: 0 0 10px 0; font-size: 15px;">What stays free:</h4>
          <p style="color: #3D4F66; margin: 0; font-size: 14px; line-height: 1.7;">
            Chat with Ollie, generate lessons, quizzes, flashcards, sub plans, and IEP goals — all free. You only pay when you download or export.
          </p>
        </div>

        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #7B5EA7;">
          <h4 style="color: #1E2A3A; margin: 0 0 10px 0; font-size: 15px;">Pro features (upgrade to keep):</h4>
          <p style="color: #3D4F66; margin: 0; font-size: 14px; line-height: 1.7;">
            Weekly prep packages, AI grading, audio updates, standards tracking, and review summaries.
          </p>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${config.frontendUrl}/teacher/billing" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 14px 32px; border-radius: 16px; font-weight: 700; font-size: 15px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            See Pro Features
          </a>
        </div>
        <p style="color: #9CA3AF; font-size: 13px; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 16px; margin: 0;">
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Hi ${teacherName},

Your 7-day Pro trial has ended, but Ollie is still here.

What stays free:
Chat with Ollie, generate lessons, quizzes, flashcards, sub plans, and IEP goals — all free. You only pay when you download or export.

Pro features (upgrade to keep):
Weekly prep packages, AI grading, audio updates, standards tracking, and review summaries.

See Pro features: ${config.frontendUrl}/teacher/billing

— The Orbit Learn Team
    `,
  }),

  /**
   * OTP verification email for teachers (Chalk branded)
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
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">${title}</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px; text-align: center;">
          ${message}
        </p>

        <!-- OTP Code Box -->
        <div style="background: #FAF7F2; border-radius: 12px; padding: 32px; margin: 28px 0; text-align: center; border: 1px solid #E5E7EB;">
          <p style="color: #3D4F66; margin: 0 0 12px 0; font-size: 14px;">Your verification code:</p>
          <div style="font-size: 44px; font-weight: bold; letter-spacing: 10px; color: #2D5A4A; font-family: 'Courier New', monospace; background: #ffffff; padding: 16px 24px; border-radius: 12px; display: inline-block; box-shadow: 0 2px 8px rgba(45, 90, 74, 0.12);">
            ${otp}
          </div>
        </div>

        <p style="color: #3D4F66; font-size: 14px; text-align: center;">
          This code expires in <strong>10 minutes</strong>.
        </p>

        <!-- Security Tip -->
        <div style="background-color: #FAF7F2; border-radius: 12px; padding: 16px 20px; margin-top: 24px; border-left: 4px solid #2D5A4A;">
          <p style="color: #1E2A3A; margin: 0; font-size: 14px;">
            <strong>Security tip:</strong> Never share this code with anyone. Orbit Learn will never ask for your code via phone or text.
          </p>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; text-align: center; margin-top: 28px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          If you didn't request this ${action}, please ignore this email or contact support if you have concerns.<br><br>
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
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

— The Orbit Learn Team
      `,
    };
  },

  /**
   * Teacher verification link email (click-to-verify, lower friction than OTP)
   */
  teacherVerificationLink: (teacherName: string, verificationUrl: string) => ({
    subject: 'Verify Your Email — Orbit Learn for Educators',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">Verify Your Email</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <h2 style="color: #1E2A3A; margin-top: 0; font-size: 22px; font-family: 'Fraunces', Georgia, serif;">Hi ${teacherName},</h2>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          You're one step away from meeting Ollie, your AI teaching assistant.
          Click below to verify your email and get started.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 40px; border-radius: 16px; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            Verify My Email
          </a>
        </div>

        <p style="color: #3D4F66; font-size: 14px; text-align: center;">
          This link expires in <strong>24 hours</strong>.
        </p>

        <!-- Alternative Link -->
        <div style="background-color: #FAF7F2; border-radius: 12px; padding: 16px 20px; margin-top: 24px;">
          <p style="color: #3D4F66; margin: 0 0 8px 0; font-size: 13px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #2D5A4A; margin: 0; font-size: 12px; word-break: break-all;">
            ${verificationUrl}
          </p>
        </div>

        <!-- Why Verify -->
        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin-top: 24px; border-left: 4px solid #2D5A4A;">
          <p style="color: #1E2A3A; margin: 0 0 12px 0; font-size: 15px; font-weight: 600;">
            Why verify?
          </p>
          <ul style="color: #3D4F66; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
            <li>Unlock Ollie's full toolkit</li>
            <li>Set up your classroom</li>
            <li>Access Pro features</li>
          </ul>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; text-align: center; margin-top: 28px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          If you didn't create an account, please ignore this email.<br><br>
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Hi ${teacherName},

You're one step away from meeting Ollie, your AI teaching assistant.
Click the link below to verify your email and get started:

${verificationUrl}

This link expires in 24 hours.

Why verify?
- Unlock Ollie's full toolkit
- Set up your classroom
- Access Pro features

If you didn't create an account, please ignore this email.

— The Orbit Learn Team
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
          <a href="${receiptUrl}" style="display: inline-block; background: #ffffff; color: #2D5A4A; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; border: 2px solid #2D5A4A;">
            View Receipt
          </a>
        </div>
      `
      : '';

    const invoiceRow = invoiceNumber
      ? `
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Invoice:</td>
              <td style="padding: 6px 0; color: #1E2A3A; font-size: 14px; font-weight: 600;">${invoiceNumber}</td>
            </tr>
        `
      : '';

    return {
      subject: `Subscription Renewed — ${planName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Renewed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">Subscription Renewed</h1>
        <p style="color: rgba(255,255,255,0.92); margin-top: 8px; font-size: 16px;">
          Ollie is ready for another month
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          Hi ${teacherName},
        </p>
        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          Your ${planName} subscription has been renewed successfully.
        </p>

        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #7BAE7F;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Plan:</td>
              <td style="padding: 6px 0; color: #1E2A3A; font-size: 14px; font-weight: 600;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Amount Paid:</td>
              <td style="padding: 6px 0; color: #1E2A3A; font-size: 14px; font-weight: 600;">${amountPaid}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Next Billing Date:</td>
              <td style="padding: 6px 0; color: #1E2A3A; font-size: 14px; font-weight: 600;">${nextBillingDate}</td>
            </tr>
            ${invoiceRow}
          </table>
        </div>

        <div style="text-align: center; margin: 28px 0 16px;">
          <a href="${config.frontendUrl}/teacher/billing" style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block; border: 2px solid #1E4035;">
            Manage Billing
          </a>
        </div>
        ${receiptSection}

        <p style="color: #9CA3AF; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          Questions? Reply to this email — we're here to help.<br><br>
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
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

Your ${planName} subscription has been renewed successfully. Ollie is ready for another month.

Plan: ${planName}
Amount Paid: ${amountPaid}
Next Billing Date: ${nextBillingDate}
${invoiceNumber ? `Invoice: ${invoiceNumber}\n` : ''}${receiptUrl ? `Receipt: ${receiptUrl}\n` : ''}
Manage billing: ${config.frontendUrl}/teacher/billing

Questions? Reply to this email — we're here to help.
— The Orbit Learn Team
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
    const urgencyColor = isUrgent ? '#E07B6B' : '#D4A853';
    const urgencyBgColor = isUrgent ? '#FEE2E2' : '#FEF3C7';
    const urgencyText = isUrgent ? '#991B1B' : '#92400E';

    return {
      subject: isUrgent
        ? `Only ${creditsRemaining} Credits Remaining — Orbit Learn`
        : `You've Used ${threshold}% of Your Monthly Credits — Orbit Learn`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credit Usage Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, ${isUrgent ? '#C75B39' : '#2D5A4A'} 0%, ${isUrgent ? '#E07B6B' : '#3D7A6A'} 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">
          ${isUrgent ? 'Credits Running Low' : 'Credit Usage Update'}
        </h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          Hi ${teacherName},
        </p>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          ${isUrgent
            ? `You've used <strong>${threshold}%</strong> of your monthly credits. You have <strong>${creditsRemaining} credits</strong> remaining.`
            : `You've used <strong>${threshold}%</strong> of your monthly credits.`
          }
        </p>

        <!-- Usage Progress Box -->
        <div style="background: ${urgencyBgColor}; border-radius: 12px; padding: 24px; margin: 28px 0; border-left: 4px solid ${urgencyColor};">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: ${urgencyText}; font-weight: 600;">Credits Used</span>
            <span style="color: ${urgencyText}; font-weight: 700;">${creditsUsed} / ${creditsTotal}</span>
          </div>
          <div style="background-color: #ffffff; border-radius: 8px; height: 12px; overflow: hidden;">
            <div style="background: ${urgencyColor}; height: 100%; width: ${threshold}%; border-radius: 8px;"></div>
          </div>
          <p style="color: ${urgencyText}; margin: 12px 0 0 0; font-size: 14px; text-align: center;">
            <strong>${creditsRemaining} credits</strong> remaining this month
          </p>
        </div>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          ${isUrgent
            ? `Upgrade your plan to keep Ollie generating content without interruption.`
            : `Need more? Upgrade to Pro for unlimited generation plus weekly prep, AI grading, and more.`
          }
        </p>

        <!-- Current Plan Info -->
        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #2D5A4A;">
          <h4 style="color: #1E2A3A; margin: 0 0 12px 0; font-size: 16px;">Your Plan: ${tier}</h4>
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;"><strong>${creditsTotal} credits</strong> per month</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Upgrade to <strong>Professional</strong> for more credits and Pro features</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/teacher/billing" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 16px 36px; border-radius: 16px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            ${isUrgent ? 'Upgrade Now' : 'View Plans'}
          </a>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Credit Usage Update

Hi ${teacherName},

${isUrgent
  ? `You've used ${threshold}% of your monthly credits. You have ${creditsRemaining} credits remaining.`
  : `You've used ${threshold}% of your monthly credits.`
}

Usage: ${creditsUsed} / ${creditsTotal} credits (${creditsRemaining} remaining)

${isUrgent
  ? 'Upgrade your plan to keep Ollie generating content without interruption.'
  : 'Need more? Upgrade to Pro for unlimited generation plus weekly prep, AI grading, and more.'
}

View plans: ${config.frontendUrl}/teacher/billing

— The Orbit Learn Team
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
    subject: `Monthly Credit Limit Reached — Orbit Learn`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credit Limit Reached</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #C75B39 0%, #E07B6B 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">
          Monthly Credit Limit Reached
        </h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          Hi ${teacherName},
        </p>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          You've used all <strong>${creditsTotal} credits</strong> in your ${tier} plan this month.
        </p>

        <!-- Limit Box -->
        <div style="background: #FEE2E2; border-radius: 12px; padding: 24px; margin: 28px 0; text-align: center; border-left: 4px solid #E07B6B;">
          <h3 style="color: #991B1B; margin: 0 0 8px 0; font-size: 18px;">No credits remaining</h3>
          <p style="color: #B91C1C; margin: 0; font-size: 14px;">
            Credits reset on the 1st of next month
          </p>
        </div>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          You can still chat with Ollie and generate content for free — you only need credits when downloading or exporting files. Or upgrade your plan for more monthly credits.
        </p>

        <!-- Options Box -->
        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #2D5A4A;">
          <h4 style="color: #1E2A3A; margin: 0 0 12px 0; font-size: 16px;">Your options:</h4>
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;"><strong>Upgrade to Professional</strong> — More credits + weekly prep, AI grading, audio updates</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;"><strong>Pay per download</strong> — Export individual files as needed</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;"><strong>Wait</strong> — Credits reset on the 1st of next month</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/teacher/billing" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 16px 36px; border-radius: 16px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            View Plans
          </a>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
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

You've used all ${creditsTotal} credits in your ${tier} plan this month. Credits reset on the 1st of next month.

You can still chat with Ollie and generate content for free — you only need credits when downloading or exporting files.

Your options:
- Upgrade to Professional — More credits + weekly prep, AI grading, audio updates
- Pay per download — Export individual files as needed
- Wait — Credits reset on the 1st of next month

View plans: ${config.frontendUrl}/teacher/billing

— The Orbit Learn Team
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
    subject: `Your ${formatName} is Ready — ${contentTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Export Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">
          Your ${formatName} is Ready
        </h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          Hi ${teacherName},
        </p>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 16px;">
          Your <strong>${formatName}</strong> export is ready for download.
        </p>

        <!-- File Info Box -->
        <div style="background: #FAF7F2; border-radius: 12px; padding: 24px; margin: 28px 0; text-align: center; border-left: 4px solid #7BAE7F;">
          <div style="font-size: 40px; margin-bottom: 8px;">${formatName === 'PowerPoint' ? '📊' : '📄'}</div>
          <h3 style="color: #1E2A3A; margin: 0 0 8px 0; font-size: 18px;">${contentTitle}</h3>
          <p style="color: #3D4F66; margin: 0; font-size: 14px;">
            ${formatName} • ${fileSize}
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${downloadUrl}" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 16px 36px; border-radius: 16px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            Download ${formatName}
          </a>
        </div>

        <p style="color: #3D4F66; font-size: 14px; text-align: center;">
          You can also find this file in your <a href="${config.frontendUrl}/teacher/downloads" style="color: #2D5A4A; font-weight: 600;">Downloads</a> section.
        </p>

        <p style="color: #9CA3AF; font-size: 13px; text-align: center; margin-top: 24px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Your ${formatName} is Ready

Hi ${teacherName},

Your ${formatName} export is ready for download.

File: ${contentTitle}
Format: ${formatName}
Size: ${fileSize}

Download your file: ${downloadUrl}

You can also find this file in your Downloads section at: ${config.frontendUrl}/teacher/downloads

— The Orbit Learn Team
    `,
  }),

  /**
   * Download Reminder — Stage 1: 24h nudge (content created, not downloaded)
   */
  downloadReminder24h: (
    teacherName: string,
    contentItems: Array<{ title: string; type: string }>,
    downloadsRemaining: number
  ) => ({
    subject: 'Your content is ready to download — Orbit Learn',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your content is ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">Your Content is Ready</h1>
        <p style="color: rgba(255,255,255,0.92); margin-top: 10px; font-size: 15px;">Download it before it gets buried</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <h2 style="color: #1E2A3A; margin-top: 0; font-size: 20px; font-family: 'Fraunces', Georgia, serif;">Hi ${teacherName},</h2>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px;">
          You created some great content recently — don't forget to download it so you can use it in class!
        </p>

        <!-- Content items list -->
        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #2D5A4A;">
          ${contentItems.map(item => `
          <div style="padding: 8px 0; border-bottom: 1px solid rgba(30,42,58,0.08);">
            <span style="color: #2D5A4A; font-weight: 600;">${item.type}</span>
            <span style="color: #3D4F66;"> — ${item.title}</span>
          </div>
          `).join('')}
        </div>

        <!-- Quota reminder -->
        <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0;">
          <p style="color: #92400E; margin: 0; font-size: 14px;">You have <strong>${downloadsRemaining} of 3</strong> free downloads remaining this month</p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/teacher/content" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            Go to My Content
          </a>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; border-top: 1px solid #E5E7EB; padding-top: 20px; margin-bottom: 0; text-align: center;">
          You're receiving this because you have un-downloaded content. <a href="${config.frontendUrl}/teacher/settings" style="color: #9CA3AF;">Unsubscribe</a><br>
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `Your content is ready to download

Hi ${teacherName},

You created some great content recently — don't forget to download it so you can use it in class!

${contentItems.map(item => `- ${item.type}: ${item.title}`).join('\n')}

You have ${downloadsRemaining} of 3 free downloads remaining this month.

Go to My Content: ${config.frontendUrl}/teacher/content

— The Orbit Learn Team
    `,
  }),

  /**
   * Download Reminder — Stage 2: 72h with inline content preview
   */
  downloadReminder72h: (
    teacherName: string,
    contentItems: Array<{ title: string; type: string }>,
    previews: Array<{
      title: string;
      type: string;
      sections: string[];
      questionCount?: number;
      vocabularyTerms: string[];
      cardCount?: number;
    }>,
    downloadsRemaining: number
  ) => ({
    subject: "Here's a peek at what you made — Orbit Learn",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview your content</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">Remember What You Made?</h1>
        <p style="color: rgba(255,255,255,0.92); margin-top: 10px; font-size: 15px;">Here's a quick look at your content</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <h2 style="color: #1E2A3A; margin-top: 0; font-size: 20px; font-family: 'Fraunces', Georgia, serif;">Hi ${teacherName},</h2>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px;">
          You created ${contentItems.length === 1 ? 'this' : 'these'} a few days ago. Here's what's inside:
        </p>

        <!-- Preview cards -->
        ${previews.map(p => `
        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 16px 0; border-left: 4px solid #2D5A4A;">
          <h3 style="color: #2D5A4A; margin: 0 0 8px 0; font-size: 16px; font-family: 'Fraunces', Georgia, serif;">${p.title}</h3>
          <p style="color: #7BAE7F; margin: 0 0 12px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${p.type}</p>
          ${p.sections.length > 0 ? `
          <div style="margin-bottom: 8px;">
            <p style="color: #3D4F66; margin: 0 0 4px 0; font-size: 13px; font-weight: 600;">Includes:</p>
            ${p.sections.map(s => `<p style="color: #3D4F66; margin: 0; font-size: 14px; padding-left: 12px;">&#8226; ${s}</p>`).join('')}
          </div>
          ` : ''}
          ${p.questionCount ? `<p style="color: #3D4F66; margin: 4px 0 0; font-size: 14px;">${p.questionCount} questions</p>` : ''}
          ${p.cardCount ? `<p style="color: #3D4F66; margin: 4px 0 0; font-size: 14px;">${p.cardCount} flashcards</p>` : ''}
          ${p.vocabularyTerms.length > 0 ? `<p style="color: #3D4F66; margin: 4px 0 0; font-size: 14px;">Key terms: ${p.vocabularyTerms.join(', ')}</p>` : ''}
        </div>
        `).join('')}

        <!-- Quota reminder -->
        <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0;">
          <p style="color: #92400E; margin: 0; font-size: 14px;">You have <strong>${downloadsRemaining} of 3</strong> free downloads remaining this month</p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${config.frontendUrl}/teacher/content" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            Download Your Content
          </a>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; border-top: 1px solid #E5E7EB; padding-top: 20px; margin-bottom: 0; text-align: center;">
          You're receiving this because you have un-downloaded content. <a href="${config.frontendUrl}/teacher/settings" style="color: #9CA3AF;">Unsubscribe</a><br>
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `Here's a peek at what you made

Hi ${teacherName},

You created ${contentItems.length === 1 ? 'this' : 'these'} a few days ago. Here's what's inside:

${previews.map(p => {
  let detail = `${p.type}: ${p.title}`;
  if (p.sections.length > 0) detail += `\n  Includes: ${p.sections.join(', ')}`;
  if (p.questionCount) detail += `\n  ${p.questionCount} questions`;
  if (p.cardCount) detail += `\n  ${p.cardCount} flashcards`;
  if (p.vocabularyTerms.length > 0) detail += `\n  Key terms: ${p.vocabularyTerms.join(', ')}`;
  return detail;
}).join('\n\n')}

You have ${downloadsRemaining} of 3 free downloads remaining this month.

Download your content: ${config.frontendUrl}/teacher/content

— The Orbit Learn Team
    `,
  }),

  /**
   * Download Reminder — Stage 3: Auto-gifted PDF
   */
  autoGiftPdf: (
    teacherName: string,
    contentTitle: string,
    downloadUrl: string,
    downloadsRemaining: number,
    resetDate: string
  ) => ({
    subject: `Your "${contentTitle}" PDF is ready — on us!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your free PDF is ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">We Made You a PDF</h1>
        <p style="color: rgba(255,255,255,0.92); margin-top: 10px; font-size: 15px;">It's on the house</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <h2 style="color: #1E2A3A; margin-top: 0; font-size: 20px; font-family: 'Fraunces', Georgia, serif;">Hi ${teacherName},</h2>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px;">
          We noticed you've been creating content but haven't downloaded any of it yet. We want you to see just how polished your exports look, so we went ahead and generated a PDF of your most recent piece:
        </p>

        <!-- Content card -->
        <div style="background: #FAF7F2; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #D4A853; text-align: center;">
          <h3 style="color: #1E2A3A; margin: 0 0 8px 0; font-size: 18px; font-family: 'Fraunces', Georgia, serif;">${contentTitle}</h3>
          <p style="color: #7BAE7F; margin: 0; font-size: 14px; font-weight: 600;">PDF ready for download</p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${downloadUrl}" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            Download Your Free PDF
          </a>
        </div>

        <!-- Urgency box -->
        <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0;">
          <p style="color: #92400E; margin: 0; font-size: 14px;">
            You have <strong>${downloadsRemaining} free download${downloadsRemaining === 1 ? '' : 's'}</strong> left this month — they reset on ${resetDate}
          </p>
        </div>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px; text-align: center;">
          Want unlimited downloads? <a href="${config.frontendUrl}/teacher/billing" style="color: #2D5A4A; font-weight: 600;">Upgrade to Teacher Unlimited</a>
        </p>

        <p style="color: #9CA3AF; font-size: 13px; border-top: 1px solid #E5E7EB; padding-top: 20px; margin-bottom: 0; text-align: center;">
          This was a one-time gift. <a href="${config.frontendUrl}/teacher/settings" style="color: #9CA3AF;">Manage notifications</a><br>
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `We made you a PDF — on the house!

Hi ${teacherName},

We noticed you've been creating content but haven't downloaded any yet. We want you to see how polished your exports look, so we generated a PDF of your most recent piece:

"${contentTitle}" — PDF ready for download

Download it here: ${downloadUrl}

You have ${downloadsRemaining} free download${downloadsRemaining === 1 ? '' : 's'} left this month — they reset on ${resetDate}.

Want unlimited downloads? Upgrade at ${config.frontendUrl}/teacher/billing

— The Orbit Learn Team
    `,
  }),

  /**
   * Package generating notification email (teacher branded)
   */
  packageGenerating: (teacherName: string, packageName: string, resourceEstimate: string, totalWeeks: number, dashboardUrl: string) => ({
    subject: `Your ${packageName} is generating!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your package is generating!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 36px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">Your Package is Generating!</h1>
        <p style="color: rgba(255,255,255,0.92); margin-top: 8px; font-size: 15px;">Ollie is hard at work creating your materials</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 36px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <h2 style="color: #1E2A3A; margin-top: 0; font-size: 20px; font-family: 'Fraunces', Georgia, serif;">Hi ${teacherName},</h2>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px;">
          Thank you for your purchase! Ollie is now creating your <strong>${packageName}</strong>. Here's what's being generated:
        </p>

        <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #D4A853;">
          <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%;">
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Materials:</td>
              <td style="padding: 6px 0; color: #1E2A3A; font-size: 14px; font-weight: 700; text-align: right;">${resourceEstimate}</td>
            </tr>
            ${totalWeeks > 0 ? `<tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Coverage:</td>
              <td style="padding: 6px 0; color: #1E2A3A; font-size: 14px; font-weight: 700; text-align: right;">${totalWeeks} ${totalWeeks === 1 ? 'week' : 'weeks'}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Estimated time:</td>
              <td style="padding: 6px 0; color: #1E2A3A; font-size: 14px; font-weight: 700; text-align: right;">5-10 minutes</td>
            </tr>
          </table>
        </div>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px;">
          We'll send you another email as soon as everything is ready. You can also track progress in your dashboard.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 14px 36px; border-radius: 16px; font-weight: bold; font-size: 15px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            Track Progress
          </a>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; border-top: 1px solid #E5E7EB; padding-top: 20px; margin-bottom: 0; text-align: center;">
          Questions? Reply to this email — we're here to help.<br>
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `Your ${packageName} is generating!

Hi ${teacherName},

Thank you for your purchase! Ollie is now creating your ${packageName}.

Materials: ${resourceEstimate}${totalWeeks > 0 ? `\nCoverage: ${totalWeeks} ${totalWeeks === 1 ? 'week' : 'weeks'}` : ''}
Estimated time: 5-10 minutes

We'll send you another email as soon as everything is ready. You can also track progress in your dashboard:
${dashboardUrl}

— The Orbit Learn Team
    `,
  }),

  /**
   * Package ready notification email (teacher branded)
   */
  packageReady: (teacherName: string, packageName: string, totalMaterials: number, totalWeeks: number, packageUrl: string) => ({
    subject: `Your ${packageName} is ready!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your package is ready!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 36px; text-align: center;">
        <img src="${config.frontendUrl}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">Your Package is Ready!</h1>
        <p style="color: rgba(255,255,255,0.92); margin-top: 8px; font-size: 15px;">Ollie finished creating your materials</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 36px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <h2 style="color: #1E2A3A; margin-top: 0; font-size: 20px; font-family: 'Fraunces', Georgia, serif;">Great news, ${teacherName}!</h2>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px;">
          Ollie finished generating your <strong>${packageName}</strong>. Everything is ready for you to review.
        </p>

        <div style="background: #ECFDF5; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #7BAE7F;">
          <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%;">
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Materials generated:</td>
              <td style="padding: 6px 0; color: #1E2A3A; font-size: 14px; font-weight: 700; text-align: right;">${totalMaterials} pieces</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #3D4F66; font-size: 14px;">Coverage:</td>
              <td style="padding: 6px 0; color: #1E2A3A; font-size: 14px; font-weight: 700; text-align: right;">${totalWeeks} ${totalWeeks === 1 ? 'week' : 'weeks'}</td>
            </tr>
          </table>
        </div>

        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px;">
          You can now review, approve, and download your materials. If anything needs tweaking, you can regenerate individual materials with a single click.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${packageUrl}" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 14px 36px; border-radius: 16px; font-weight: bold; font-size: 15px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
            View Your Package
          </a>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; border-top: 1px solid #E5E7EB; padding-top: 20px; margin-bottom: 0; text-align: center;">
          Questions? Reply to this email — we're here to help.<br>
          <span style="color: #3D4F66;">— The Orbit Learn Team</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `Your ${packageName} is ready!

Great news, ${teacherName}!

Ollie finished generating your ${packageName}. Everything is ready for you to review.

Materials generated: ${totalMaterials} pieces
Coverage: ${totalWeeks} ${totalWeeks === 1 ? 'week' : 'weeks'}

You can now review, approve, and download your materials. If anything needs tweaking, you can regenerate individual materials with a single click.

View your package: ${packageUrl}

— The Orbit Learn Team
    `,
  }),
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
   * Send welcome email to new teacher
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
   * Send 24h download reminder (Stage 1)
   */
  async sendDownloadReminder24hEmail(
    email: string,
    teacherName: string,
    contentItems: Array<{ title: string; type: string }>,
    downloadsRemaining: number
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped download reminder 24h email to ${email}`);
      return true;
    }

    try {
      const template = templates.downloadReminder24h(teacherName, contentItems, downloadsRemaining);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send download reminder 24h email', { error, email });
        return false;
      }

      logger.info(`Download reminder 24h email sent to ${email}`, { itemCount: contentItems.length });
      return true;
    } catch (error) {
      logger.error('Error sending download reminder 24h email', { error, email });
      return false;
    }
  },

  /**
   * Send 72h download reminder with preview (Stage 2)
   */
  async sendDownloadReminder72hEmail(
    email: string,
    teacherName: string,
    contentItems: Array<{ title: string; type: string }>,
    previews: Array<{
      title: string;
      type: string;
      sections: string[];
      questionCount?: number;
      vocabularyTerms: string[];
      cardCount?: number;
    }>,
    downloadsRemaining: number
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped download reminder 72h email to ${email}`);
      return true;
    }

    try {
      const template = templates.downloadReminder72h(teacherName, contentItems, previews, downloadsRemaining);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send download reminder 72h email', { error, email });
        return false;
      }

      logger.info(`Download reminder 72h email sent to ${email}`, { itemCount: contentItems.length });
      return true;
    } catch (error) {
      logger.error('Error sending download reminder 72h email', { error, email });
      return false;
    }
  },

  /**
   * Send auto-gifted PDF email (Stage 3)
   */
  async sendAutoGiftPdfEmail(
    email: string,
    teacherName: string,
    contentTitle: string,
    downloadUrl: string,
    downloadsRemaining: number,
    resetDate: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped auto gift PDF email to ${email}`);
      return true;
    }

    try {
      const template = templates.autoGiftPdf(teacherName, contentTitle, downloadUrl, downloadsRemaining, resetDate);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send auto gift PDF email', { error, email });
        return false;
      }

      logger.info(`Auto gift PDF email sent to ${email}`, { contentTitle });
      return true;
    } catch (error) {
      logger.error('Error sending auto gift PDF email', { error, email });
      return false;
    }
  },

  /**
   * Send package generating notification email
   */
  async sendPackageGeneratingEmail(
    email: string,
    teacherName: string,
    packageName: string,
    resourceEstimate: string,
    totalWeeks: number,
    dashboardUrl: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped package generating email to ${email}`);
      return true;
    }

    try {
      const template = templates.packageGenerating(teacherName, packageName, resourceEstimate, totalWeeks, dashboardUrl);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send package generating email', { error, email });
        return false;
      }

      logger.info(`Package generating email sent to ${email}`, { packageName });
      return true;
    } catch (error) {
      logger.error('Error sending package generating email', { error, email });
      return false;
    }
  },

  /**
   * Send package ready notification email
   */
  async sendPackageReadyEmail(
    email: string,
    teacherName: string,
    packageName: string,
    totalMaterials: number,
    totalWeeks: number,
    packageUrl: string
  ): Promise<boolean> {
    if (config.email.skipEmails || !resend) {
      logger.info(`[Email] Skipped package ready email to ${email}`);
      return true;
    }

    try {
      const template = templates.packageReady(teacherName, packageName, totalMaterials, totalWeeks, packageUrl);

      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        logger.error('Failed to send package ready email', { error, email });
        return false;
      }

      logger.info(`Package ready email sent to ${email}`, { packageName });
      return true;
    } catch (error) {
      logger.error('Error sending package ready email', { error, email });
      return false;
    }
  },
};
