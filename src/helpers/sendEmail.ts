import nodemailer from 'nodemailer'
import express,{Request,Response} from 'express'
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'alife.silva@unifesspa.edu.br',
      pass: `${process.env.PASSWORD_EMAIL}`,
    },
  });
export const sendEmail = (email:string,res:Response,title:string,paragraph:string,subject:string) => {
  const mailOptions = {
    from: 'alife.silva@unifesspa.edu.br',
    to: `${email}`,
    subject: subject,
    html: `
      <html>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@700&family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
          <style>
            body {
              width: 100%;
            }
            h1 {
              font-family: 'Barlow', sans-serif;
              font-size: 27px;
              font-weight: bold;
              margin-top: 5rem;
              text-align: center;
            }
            p {
              font-size: 22px;
              font-family: 'Inter', sans-serif;
              font-weight: 500;
              color: #666666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>${paragraph}</p>
        </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error(error);
      //res.json({message: 'Erro ao enviar e-mail',});
    } else {
        console.log('enviado')
        //res.json({status:true});
    }
  });

} 