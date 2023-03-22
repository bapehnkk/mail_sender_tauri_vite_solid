use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use lettre::transport::smtp::Error;
use lettre::transport::smtp::response::Response;
use crate::file_handler::{read_html_file};

use local_ip_address::local_ip;
use chrono::Local;


pub(crate) struct Mail {
    pub(crate) email: String,
    pub(crate) senders_name: String,
    pub(crate) title: String,
    pub(crate) recipients_name: String,
    pub(crate) text: String,
    pub(crate) files: Vec<String>,
    pub(crate) html_abs_path: String,
}

#[derive(Debug)]
#[derive(serde::Deserialize)]
pub(crate) struct Creds {
    pub(crate) email: String,
    pub(crate) password: String,
    pub(crate) server: String,
}

pub(crate) async fn send_mail(
    mail: Mail,
    creds: Creds,
) -> Result<Response, Error> {
    // let body = match mail.html_abs_path.len() {
    //     0 => mail.text,
    //     _ => match get_html_body(mail.html_abs_path.as_str()) {
    //         Some(body) => body,
    //         None => String::new(),
    //     }
    // };
    let html_contents = read_html_file(mail.html_abs_path.as_str());

    let email = Message::builder()
        .from(format!("{} <{}>", mail.senders_name, creds.email).parse().unwrap())
        .to(format!("{} <{}>", mail.recipients_name, mail.email).parse().unwrap())
        .subject(mail.title)
        .header(match html_contents.as_str() {
            "" => ContentType::TEXT_PLAIN,
            _ => ContentType::TEXT_HTML
        })
        .body(match html_contents.as_str() {
            "" => mail.text,
            _ => html_contents
        })
        .unwrap();

    let smtp_credentials =
        Credentials::new(creds.email, creds.password);

    let mailer = SmtpTransport::relay(creds.server.as_str())
        .unwrap()
        .credentials(smtp_credentials)
        .build();

    mailer.send(&email)
}

pub(crate) async fn validate_creds(
    creds: Creds
) -> Result<Response, Error>  {
    let my_local_ip = local_ip().unwrap();
    let now = Local::now();
    let current_time = now.format("%H:%M:%S").to_string();

    let email = Message::builder()
        .from(format!("{} <{}>", creds.email.clone(), creds.email.clone()).parse().unwrap())
        .to(format!("{} <{}>", creds.email.clone(), creds.email.clone()).parse().unwrap())
        .subject(String::from("Warning: You are logged into the Mail Sender app"))
        .header(ContentType::TEXT_PLAIN)
        .body(format!("You are logged into the Mail Sender application from IP address: \n{:?}\nTime: {:?}", my_local_ip, current_time))
        .unwrap();

    let smtp_credentials =
        Credentials::new(creds.email.clone(), creds.password);

    let mailer = SmtpTransport::relay(creds.server.as_str())
        .unwrap()
        .credentials(smtp_credentials)
        .build();

    mailer.send(&email)
}
