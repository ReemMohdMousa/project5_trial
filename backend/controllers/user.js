const { genrateToken } = require("./config");

const { pool } = require("../models/db");

const { OAuth2Client } = require("google-auth-library");

//const  = require("../models/patientSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { types } = require("pg");
nodemailer = require("nodemailer");
// const saltRounds = parseInt(process.env.SALT);

const register = async (req, res) => {
  const { firstName, lastName, age, email, password, role_id } = req.body;
  try {
    const encryptedPassword = await bcrypt.hash(password, 7);
    const query = `INSERT INTO users (firstName, lastName, age, email, password,role_id) VALUES ($1,$2,$3,$4,$5,$6)RETURNING *`;
    const data = [
      firstName,
      lastName,
      age,
      email.toLowerCase(),
      encryptedPassword,
      role_id || 2,
    ];
    pool
      .query(query, data)
      .then((result) => {
        const payload = {
          userId: result.rows[0].user_id,
          role: result.rows[0].role_id,
          firstname: result.rows[0].firstName,
          lastname: result.rows[0].lastName,
        };
        const options = {
          expiresIn: "24h",
        };
        const token = genrateToken(payload, options);

        res.status(200).json({
          success: true,
          token: token,
          userId: result.rows[0].user_id,
          roleId: result.rows[0].role_id,
          message: "Account created successfully",
        });
        verfiyResjsterByEmail(email, firstName, lastName);
      })
      .catch((err) => {
        res.status(409).json({
          success: false,
          message: "The email already exists",
          err,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const query = `SELECT * FROM users WHERE email = $1`;
  const data = [email.toLowerCase()];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              userId: result.rows[0].user_id,
              role: result.rows[0].role_id,
              firstname: result.rows[0].firstName,
              lastname: result.rows[0].lastName,
            };

            const options = {
              expiresIn: "24h",
            };
            const token = genrateToken(payload, options);

            if (token) {
              return res.status(200).json({
                success: true,
                message: `Valid login credentials`,
                token,
                userId: result.rows[0].user_id,
                roleId: result.rows[0].role_id,
              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`,
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err,
      });
    });
};

const checkGoogleUser = (req, res) => {
  const token = req.body.credential;
  const CLIENT_ID = req.body.clientId;
  const client = new OAuth2Client(CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    res.json(payload);
  }
  verify().catch((err) => {
    if (err.keyPattern) {
      res.status(409).json({
        success: false,
        message: `Email is already exist`,
      });
    } else {
      res.status(500).json({
        success: false,
        message: `Server error`,
        err: err.message,
      });
    }
  });
};

const profileInfo = (req, res) => {
  const user_id = req.token.userId;
  const query = "SELECT * FROM users WHERE user_id=$1";
  pool
    .query(query, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(200).json({
          success: false,
          message: `The user: ${user_id} has no info`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All info for the user: ${user_id}`,
          info: result.rows,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const otherUsersInfo = (req, res) => {
  const user_id = req.params.id;
  const query = "SELECT * FROM users WHERE user_id=$1";
  pool
    .query(query, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(200).json({
          success: false,
          message: `The user: ${user_id} has no info`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All info for the user: ${user_id}`,
          result: result.rows[0],
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const editUserInfo = (req, res) => {
  const user_id = req.token.userId;

  let { avatar, coverImg, bio } = req.body;
  const data = [avatar, coverImg, bio, user_id];

  const query = `UPDATE posts SET 
  avatar = COALESCE($1,avatar), 
  coverImg = COALESCE($2, coverImg), 
  bio = COALESCE($3, bio), 
  updated_at=NOW() 
  WHERE user_id=$4 RETURNING *;`;

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(200).json({
          success: false,
          message: `no data found`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `user's info updated sucessfully `,
          post: result.rows[0],
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const verfiyResjsterByEmail = (email, firstName, lastName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tasnim.gharaibeh@gmail.com",
      pass: "tzzjtrcepxmotljz",
    },
  });

  const mailOptions = {
    from: "tasnim.gharaibeh@gmail.com",
    to: email,
    subject: "Subject",

    html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>
      
        <style type="text/css">
          @media only screen and (min-width: 620px) {
      .u-row {
        width: 600px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }
    
      .u-row .u-col-100 {
        width: 600px !important;
      }
    
    }
    
    @media (max-width: 620px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }
      .u-row {
        width: 100% !important;
      }
      .u-col {
        width: 100% !important;
      }
      .u-col > div {
        margin: 0 auto;
      }
    }
    body {
      margin: 0;
      padding: 0;
    }
    
    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }
    
    p {
      margin: 0;
    }
    
    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }
    
    * {
      line-height: inherit;
    }
    
    a[x-apple-data-detectors='true'] {
      color: inherit !important;
      text-decoration: none !important;
    }
    
    @media (max-width: 480px) {
      .hide-mobile {
        max-height: 0px;
        overflow: hidden;
        display: none !important;
      }
    }
    
    table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 87% !important; } #u_content_heading_1 .v-container-padding-padding { padding: 40px 10px 0px !important; } #u_content_text_2 .v-container-padding-padding { padding: 5px 10px 10px !important; } #u_content_text_deprecated_1 .v-container-padding-padding { padding: 40px 10px 10px !important; } #u_content_menu_1 .v-padding { padding: 5px 10px !important; } }
        </style>
      
      
    
    <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
    
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ecf0f1;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ecf0f1;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ecf0f1;"><![endif]-->
        
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
      
    <table id="u_content_image_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:60px 0px 0px;font-family:'Raleway',sans-serif;" align="left">
            
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          
          <img align="center" border="0" src="images/image-5.png" alt="image" title="image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 74%;max-width: 444px;" width="444" class="v-src-width v-src-max-width"/>
          
        </td>
      </tr>
    </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Raleway',sans-serif;" align="left">
            
      <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 3px solid #ecf0f1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
              <span>&#160;</span>
            </td>
          </tr>
        </tbody>
      </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table id="u_content_heading_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 5px;font-family:'Raleway',sans-serif;" align="left">
            
      <h1 style="margin: 0px; color: #f35900; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Playfair Display',serif; font-size: 26px; "><strong>Unlayer</strong></h1>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table id="u_content_text_2" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 50px 10px;font-family:'Raleway',sans-serif;" align="left">
            
      <div style="line-height: 140%; text-align: center; word-wrap: break-word;">
        <p style="line-height: 140%;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.</p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Raleway',sans-serif;" align="left">
            
      <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
    <div align="center">
      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.unlayer.com" style="height:37px; v-text-anchor:middle; width:162px;" arcsize="11%"  stroke="f" fillcolor="#f35900"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Raleway',sans-serif;"><![endif]-->  
        <a href="https://www.unlayer.com" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:'Raleway',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #f35900; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
          <span class="v-padding" style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">Confirm Your Email</span></span>
        </a>
      <!--[if mso]></center></v:roundrect><![endif]-->
    </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
      
    <table id="u_content_text_deprecated_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:40px 80px 10px;font-family:'Raleway',sans-serif;" align="left">
            
      <div style="line-height: 160%; text-align: center; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 160%;">if you have any questions, please email us at <a rel="noopener" href="https://www.unlayer.com" target="_blank">customer.success@unlayer.com</a> or visit our FAQS, you can also chat with a reel live human during our operating hours. They can answer questions about your account</p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 0px;font-family:'Raleway',sans-serif;" align="left">
            
      <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
              <span>&#160;</span>
            </td>
          </tr>
        </tbody>
      </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Raleway',sans-serif;" align="left">
            
    <div align="center">
      <div style="display: table; max-width:187px;">
      <!--[if (mso)|(IE)]><table width="187" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:187px;"><tr><![endif]-->
      
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://www.facebook.com/unlayer" title="Facebook" target="_blank">
              <img src="images/image-4.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://twitter.com/unlayerapp" title="Twitter" target="_blank">
              <img src="images/image-1.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://www.linkedin.com/company/unlayer/mycompany/" title="LinkedIn" target="_blank">
              <img src="images/image-3.png" alt="LinkedIn" title="LinkedIn" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://www.instagram.com/unlayer_official/" title="Instagram" target="_blank">
              <img src="images/image-2.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        
        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
      </div>
    </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table id="u_content_menu_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Raleway',sans-serif;" align="left">
            
    <div class="menu" style="text-align:center">
    <!--[if (mso)|(IE)]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"><tr><![endif]-->
    
      <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
      
        <a href="https://www.unlayer.com" target="_self" style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;text-decoration:none"  class="v-padding">
          Home
        </a>
      
      <!--[if (mso)|(IE)]></td><![endif]-->
      
        <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
        <span style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;" class="v-padding hide-mobile">
          |
        </span>
        <!--[if (mso)|(IE)]></td><![endif]-->
      
    
      <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
      
        <a href="https://www.unlayer.com" target="_self" style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;text-decoration:none"  class="v-padding">
          Page
        </a>
      
      <!--[if (mso)|(IE)]></td><![endif]-->
      
        <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
        <span style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;" class="v-padding hide-mobile">
          |
        </span>
        <!--[if (mso)|(IE)]></td><![endif]-->
      
    
      <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
      
        <a href="https://www.unlayer.com" target="_self" style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;text-decoration:none"  class="v-padding">
          About Us
        </a>
      
      <!--[if (mso)|(IE)]></td><![endif]-->
      
        <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
        <span style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;" class="v-padding hide-mobile">
          |
        </span>
        <!--[if (mso)|(IE)]></td><![endif]-->
      
    
      <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
      
        <a href="https://www.unlayer.com" target="_self" style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;text-decoration:none"  class="v-padding">
          Contact US
        </a>
      
      <!--[if (mso)|(IE)]></td><![endif]-->
      
    
    <!--[if (mso)|(IE)]></tr></table><![endif]-->
    </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 40px;font-family:'Raleway',sans-serif;" align="left">
            
      <div style="line-height: 160%; text-align: center; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 160%;">you have received this email as a registered user of <a rel="noopener" href="https://www.unlayer.com" target="_blank">unlayer.com</a></p>
    <p style="font-size: 14px; line-height: 160%;">can <a rel="noopener" href="https://www.unlayer.com" target="_blank">unsubscribe</a> from these emails here.</p>
    <p style="font-size: 14px; line-height: 160%;"> </p>
    <p style="font-size: 14px; line-height: 160%;">2261 Market Street #4667 San Francisco, CA 94114 All rights reserved</p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
      </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
    
    </html>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      // res.json({
      //   success:true,
      //   message:"Email is sent"
      // })
      // do something useful
    }
  });
};
//https://beefree.io/templates/
//https://unlayer.com/

module.exports = {
  register,
  login,
  checkGoogleUser,
  profileInfo,
  otherUsersInfo,
  editUserInfo
};
