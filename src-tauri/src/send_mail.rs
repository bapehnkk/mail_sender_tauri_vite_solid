use lettre::{
    transport::smtp::authentication::Credentials, AsyncSmtpTransport, AsyncTransport, Message,
    Tokio1Executor,
};

pub async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let smtp_credentials =
        Credentials::new("email".to_string(), "pass".to_string());

    let mailer = AsyncSmtpTransport::<Tokio1Executor>::builder_dangerous("server")
        .credentials(smtp_credentials)
        .build();


    let from = "Hello World <email>";
    let to = "42 <example@gmail.com>";
    let subject = "Hello World";
    let body = "<h1>Hello World</h1>".to_string();

    send_email_smtp(&mailer, from, to, subject, body).await
}

async fn send_email_smtp(
    mailer: &AsyncSmtpTransport<Tokio1Executor>,
    from: &str,
    to: &str,
    subject: &str,
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


