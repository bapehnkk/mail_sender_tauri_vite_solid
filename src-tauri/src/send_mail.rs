use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use lettre::transport::smtp::Error;
use lettre::transport::smtp::response::Response;

pub(crate) struct Mail {
    pub(crate) email: String,
    pub(crate) senders_name: String,
    pub(crate) title: String,
    pub(crate) recipients_name: String,
    pub(crate) text: String,
    pub(crate) files: Vec<String>,
}

pub(crate) fn main(
    mail: Mail
) -> Result<Response, Error> {
    let email = Message::builder()
        .from(format!("{} <elmeo@elmeo.eu>", mail.senders_name).parse().unwrap())
        .to(format!("{} <{}>", mail.recipients_name, mail.email).parse().unwrap())
        .subject(mail.title)
        .header(ContentType::TEXT_PLAIN)
        .body(mail.text)
        .unwrap();

    let smtp_credentials =
    Credentials::new("elmeo@elmeo.eu".to_string(), "v3Karberi2K8D".to_string());

    // Open a remote connection to gmail
    let mailer = SmtpTransport::relay("jet.digisoov.ee")
        .unwrap()
        .credentials(smtp_credentials)
        .build();


    // Send the email
    mailer.send(&email)
}


// use lettre::{
//     transport::smtp::authentication::Credentials, AsyncSmtpTransport, AsyncTransport, Message,
//     Tokio1Executor,
// };
//
// use regex::Regex;
// fn validate_email(email: &str) -> bool {
//     let re = Regex::new(r"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$").unwrap();
//     re.is_match(email)
// }
//
//
// pub fn main(
//     senders_name: String,
//     title: String,
//     recipients_name: String,
//     text: String,
//     files: Vec<String>,
// ) -> Result<(), Box<dyn std::error::Error>> {
//     let smtp_credentials =
//         Credentials::new("elmeo@elmeo.eu".to_string(), "v3Karberi2K8D".to_string());
//
//     let mailer = AsyncSmtpTransport::<Tokio1Executor>::builder_dangerous("jet.digisoov.ee")
//         .credentials(smtp_credentials)
//         .build();
//
//
//     let from = format!("{senders_name} <elmeo@elmeo.eu>").to_string();
//     let to = format!("{recipients_name} <bapehnkk@gmail.com>").to_string();
//
//     send_email_smtp(&mailer, from, to, title, text).await
// }
//
// async fn send_email_smtp(
//     mailer: &AsyncSmtpTransport<Tokio1Executor>,
//     from: String,
//     to: String,
//     subject: String,
//     body: String,
// ) -> Result<(), Box<dyn std::error::Error>> {
//     let email = Message::builder()
//         .from(from.parse()?)
//         .to(to.parse()?)
//         .subject(subject)
//         .body(body.to_string())?;
//
//     mailer.send(email).await?;
//
//     Ok(())
// }
//
//
