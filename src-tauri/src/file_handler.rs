use ndarray::{Array2, Axis};
use std;
use calamine::{Reader, open_workbook, Xlsx, DataType};
use calamine::DataType::Empty;
use regex::Regex;


fn validate_email(email: &str) -> bool {
    let re = Regex::new(r"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$").unwrap();
    re.is_match(email)
}


fn array2_to_vec_of_vec<T: Clone>(arr: &Array2<T>) -> Vec<Vec<T>> {
    arr.axis_iter(Axis(0))
        .map(|row| row.to_vec())
        .collect()
}

#[derive(Debug)]
pub struct Row {
    emails: Vec<String>,
    names: Vec<String>,
    surnames: Vec<String>,
}

use std::error::Error;

pub(crate) fn get_header(file_path: String) -> Result<Vec<String>, Box<dyn Error>> {
    let mut header: Vec<String> = vec![];
    let mut excel: Xlsx<_> = open_workbook(file_path)?;

    for sheet in excel.sheet_names().to_vec() {
        if let Some(Ok(r)) = excel.worksheet_range(&sheet) {
            for row in r.rows() {
                for cell in row.to_vec() {
                    if !cell.to_string().is_empty() {
                        header.push(cell.to_string());
                    }
                }
                break;
            }
        }
        break;
    }

    if header.is_empty() {
        return Err("Header not found".into());
    }

    Ok(header)
}


pub(crate) fn read_excel_with_email(
    file_path: String,
    selected_emails: &[String],
    selected_names: &[String],
    selected_surnames: &[String],
) -> Vec<Row> {
    let mut parse_result: Vec<Row> = vec![];
    let mut excel: Xlsx<_> = open_workbook(file_path).unwrap();

    let mut email_ids: Vec<usize> = vec![];
    let mut name_ids: Vec<usize> = vec![];
    let mut surname_ids: Vec<usize> = vec![];

    for sheet in excel.sheet_names().to_vec() {
        if let Some(Ok(r)) = excel.worksheet_range(&sheet) {
            for (i, row) in r.rows().enumerate() {
                if i == 0 {
                    for (j, cell) in row.to_vec().iter().enumerate() {
                        // Как-то надобно сократить эти 3 повторяющихся for loop
                        // Get selected IDs
                        for email in selected_emails {
                            if email == &cell.to_string() {
                                email_ids.push(j);
                            }
                        }
                        for name in selected_names {
                            if name == &cell.to_string() {
                                name_ids.push(j);
                            }
                        }
                        for surname in selected_surnames {
                            if surname == &cell.to_string() {
                                surname_ids.push(j);
                            }
                        }
                    }
                }
                if i != 0 {
                    let mut parse_row: Row = Row {
                        emails: vec![],
                        names: vec![],
                        surnames: vec![],
                    };
                    // Как-то надобно сократить эти 3 повторяющихся for loop
                    for id in &email_ids {
                        if !row[*id].to_string().is_empty() {
                            let email = row[*id].to_string();
                            if validate_email(&email) {
                                parse_row.emails.push(email)
                            }
                        }
                    }
                    for id in &name_ids {
                        if !row[*id].to_string().is_empty() {
                            parse_row.names.push(row[*id].to_string())
                        }
                    }
                    for id in &surname_ids {
                        if !row[*id].to_string().is_empty() {
                            parse_row.surnames.push(row[*id].to_string())
                        }
                    }

                    // если в строке не emails
                    if !parse_row.emails.is_empty() {
                        parse_result.push(parse_row);
                    }
                }
            }
        }
        break;
    }
    parse_result
}

fn print_type_of<T>(_: &T) {
    println!("{}", std::any::type_name::<T>())
}

