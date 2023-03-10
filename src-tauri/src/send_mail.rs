use lettre::{
    transport::smtp::authentication::Credentials, AsyncSmtpTransport, AsyncTransport, Message,
    Tokio1Executor,
};

pub async fn main(
    senders_name: String,
    title: String,
    recipients_name: String,
    text: String,
    files: Vec<String>,
) -> Result<(), Box<dyn std::error::Error>> {
    let smtp_credentials =
        Credentials::new("elmeo@elmeo.eu".to_string(), "v3Karberi2K8D".to_string());

    let mailer = AsyncSmtpTransport::<Tokio1Executor>::builder_dangerous("jet.digisoov.ee")
        .credentials(smtp_credentials)
        .build();


    let from = format!("{senders_name} <elmeo@elmeo.eu>").to_string();
    let to = format!("{recipients_name} <bapehnkk@gmail.com>").to_string();

    send_email_smtp(&mailer, from, to, title, text).await
}

async fn send_email_smtp(
    mailer: &AsyncSmtpTransport<Tokio1Executor>,
    from: String,
    to: String,
    subject: String,
    body: String,
) -> Result<(), Box<dyn std::error::Error>> {
    let email = Message::builder()
        .from(from.parse()?)
        .to(to.parse()?)
        .subject(subject)
        .body(body.to_string())?;

    mailer.send(email).await?;

    Ok(())
}


