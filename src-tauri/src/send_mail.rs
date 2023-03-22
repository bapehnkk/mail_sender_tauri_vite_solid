use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use lettre::transport::smtp::Error;
use lettre::transport::smtp::response::Response;
use crate::file_handler::{read_html_file};


pub(crate) struct Mail {
    pub(crate) email: String,
    pub(crate) senders_name: String,
    pub(crate) title: String,
    pub(crate) recipients_name: String,
    pub(crate) text: String,
    pub(crate) files: Vec<String>,
    pub(crate) html_abs_path: String,
}

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
