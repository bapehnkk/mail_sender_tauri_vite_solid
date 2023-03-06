import {
    createForm,
    email,
    Form,
    minLength,
    required,
} from '@modular-forms/solid';
import {Typography} from "@suid/material";
import Field from "../components/FormField"

type LoginForm = {
    email: string;
    password: string;
};

export default function HomeScreen() {
    // Create login form
    const loginForm = createForm<LoginForm>();

    return (
        <div class={"container"}>
            <div class="form">
                <Field
                    svg={"sender"}
                    htmlID={"sender-name"}
                    fieldType={"text"}
                    content={"Sender's name"}
                ></Field>

                <Field
                    svg={"title"}
                    htmlID={"title"}
                    fieldType={"text"}
                    content={"Mail title"}
                    description={"Write [name] or [surname] and select Excel column name if you want to personalize the email"}
                >
                    <Field
                        htmlID={"titleInPdf"}
                        svg={"edit-doc"}
                        fieldType={"text"}
                        content={"Chose title in .pdf"}
                    ></Field>
                </Field>


                <Field
                    svg={"recipient"}
                    htmlID={"recipients-name"}
                    fieldType={"text"}
                    content={"Recipient's name"}
                    description={"Select the column corresponding to the name of the recipient of the letter in Excel"}
                ></Field>

                <Field
                    htmlID={"recipients-name"}
                    fieldType={"textarea"}
                    content={"Recipient's name"}
                    description={"Select the column corresponding to the name of the recipient of the letter in Excel"}
                >
                    <Field
                        svg={"upload"}
                        htmlID={"choose-file"}
                        fieldType={"file"}
                        content={"Choose file:"}
                    ></Field>
                    <Field
                        svg={"upload"}
                        htmlID={"choose-files"}
                        fieldType={"files"}
                        content={"Choose files:"}
                    ></Field>
                    <Field
                        svg={"upload"}
                        htmlID={"excel-pdf"}
                        fieldType={"excel"}
                        content={"Choose excel:"}
                    ></Field>
                    <Field
                        svg={"upload"}
                        htmlID={"choose-pdf"}
                        fieldType={"pdf"}
                        content={"Choose pdf:"}
                    ></Field>
                    <Field
                        svg={"upload"}
                        htmlID={"choose-html"}
                        fieldType={"html"}
                        content={"Choose html:"}
                    ></Field>
                </Field>


                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <div class="form__field">
                    <label for="sender-name" class="form__field-label">
                        <span class="svg sender"></span>
                    </label>
                    <input id="sender-name" type="text" class="form__field-input" placeholder="Sender's name"
                           title="Sender's name"/>
                </div>
                <div class="form__field customizable">
                    <label for="title" class="form__field-label cur-help">
                        <span class="svg title"></span>
                        <div class="form__field-description">
                            Write [name] or [surname] and select Excel column name if you want to personalize the email
                        </div>
                    </label>
                    <input id="title" type="text" class="form__field-input" placeholder="Mail title"
                           title="Mail title"/>
                    <span class="form__field-label settings">
                        <span class="svg settings-v2"></span>
                    </span>
                    <div class="form__field-settings">
                        <div class="form__field-settings__close ">
                            <div class="burger active">
                                <span class="burger__span"></span>
                            </div>
                        </div>
                        {/*{% include 'components/title_settings.html' %}*/}
                        <div class="form__field">
                            <label for="" class="form__field-label">
                                <span class="svg edit-doc"></span>
                            </label>
                            <input type="text" class="form__field-input sub" placeholder="Chose title in .pdf"
                                   title="Chose title in .pdf"/>
                        </div>

                    </div>
                </div>
                <div class="form__field">
                    <label for="recipients-name" class="form__field-label cur-help">
                        <span class="svg recipient"></span>
                        <div class="form__field-description">
                            Select the column corresponding to the name of the recipient of the letter in Excel
                        </div>
                    </label>
                    <input id="recipients-name" type="text" class="form__field-input" placeholder="Recipient's name"
                           title="Recipient's name"/>
                </div>


                <div class="form__field customizable textarea">
                    <textarea id="mail-text" class="form__field-input" name="" cols="30" rows="10"
                              placeholder="Mail text"
                              title="Mail text"></textarea>
                    <span class="form__field-label settings">
                        <span class="svg settings-v2"></span>
                    </span>
                    <div class="form__field-settings">
                        <div class="form__field-settings__close ">
                            <div class="burger active">
                                <span class="burger__span"></span>
                            </div>
                        </div>
                        {/*{% include 'components/text_settings.html' %}*/}

                        <div class="form__field">
                            <label class="form__field-label cur-help">
                                <span class="svg html"></span>
                                <div class="form__field-description">
                                    Create a mail template from .html file
                                </div>
                            </label>
                            <label for="choose-html" class="form__field-input sub cur-pointer">
                                Choose html
                            </label>
                            <input type="file" id="choose-html" accept=".html" class="d-none"/>
                        </div>
                        <div class="form__field">
                            <label class="form__field-label cur-help">
                                <span class="svg pdf"></span>
                                <div class="form__field-description">
                                    Create a mail template from pdf file
                                </div>
                            </label>
                            <label for="choose-pdf" class="form__field-input sub cur-pointer">
                                Choose pdf
                            </label>
                            <input type="file" id="choose-pdf" accept=".pdf" class="d-none"/>
                        </div>

                        <div class="form__field">
                            <label class="form__field-label cur-help">
                                <span class="svg pdf"></span>
                                <div class="form__field-description">
                                    Create a mail template from pdf file
                                </div>
                            </label>
                            <label class="form__field-input sub cur-pointer">
                                Choose file
                            </label>
                        </div>

                    </div>
                </div>


                <div class="form__field customizable">

                    <label for="choose-files" class="form__field-label cur-help">
                        <span class="svg file-present"></span>
                        <div class="form__field-description">
                            Select the files to be attached to the email
                        </div>
                    </label>
                    <label for="choose-files" class="form__field-input cur-pointer">
                        Choose files
                    </label>
                    <input type="file" id="choose-files" multiple class="d-none"/>
                    <span class="form__field-label settings">
                        <span class="svg settings-v2 visibility"></span>
                    </span>
                    <div class="form__field-settings">
                        <div class="form__field-settings__close ">
                            <div class="burger active">
                                <span class="burger__span"></span>
                            </div>
                        </div>
                        {/*{% include 'components/choose_files.html' %}*/}
                        <ul class="selected-files">
                            <li>0 files selected</li>
                        </ul>
                    </div>
                </div>

                <div class="form__field customizable">
                    <label for="choose-excel" class="form__field-label cur-help">
                        <span class="svg excel"></span>
                        <div class="form__field-description">
                            You must select an Excel file and a column with E-mail
                        </div>
                    </label>
                    <label for="choose-excel" class="form__field-input cur-pointer">
                        Choose Excel file*
                    </label>
                    <input type="file"
                           accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                           id="choose-excel" class="d-none"/>
                    <span class="form__field-label settings">
                        <span class="svg settings-v2"></span>
                    </span>
                    <div class="form__field-settings">
                        <div class="form__field-settings__close ">
                            <div class="burger active">
                                <span class="burger__span"></span>
                            </div>
                        </div>
                        <div class="select-columns"></div>
                    </div>
                </div>
                <div class="form__field">
                    <label for="pdf-duplicate" class="form__field-label cur-pointer">
                        <span class="svg pdf "></span>
                    </label>


                    <label for="pdf-duplicate" class="form__field-input cur-pointer">
                        Attach a .pdf file as a duplicate of the mail
                        <input id="pdf-duplicate" type="checkbox"/><label for="pdf-duplicate"
                                                                          class="checkbox-label">Toggle</label>
                    </label>
                </div>


                <div class="form__field">
                    <button type="submit" class="form__field-submit" value="Send">
                        Send
                        <span class="svg send_mail"></span>
                    </button>
                </div>
            </div>
        </div>
    );
}
