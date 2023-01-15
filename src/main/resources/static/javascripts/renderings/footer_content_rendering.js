function renderFooter() {
    document.getElementById("footer_content").innerHTML = `
    <div class="wrapper">
        <section id="footer_left">
            <div class="wrapper">
                <table id="contact_info_footer">
                    <tr class="footer_row">
                        <th class="title">Contact info</th>
                    </tr>
                    <tr class="footer_row">
                        <td class="description">Email: bandwich@mail.com</td>
                    </tr>
                    <tr class="footer_row">
                        <td class="description">Telefon: +45 60548098</td>
                    </tr>
                    <tr class="footer_row">
                        <td class="description">Country: Denmark</td>
                    </tr>
                    <tr class="footer_row">
                        <td class="description">Address: <a href="https://www.google.com/maps?client=firefox-b-d&q=n%C3%B8rre+boulevard+98+k%C3%B8ge&um=1&ie=UTF-8&sa=X&ved=2ahUKEwi-8ouNl9j7AhUSXfEDHSQSDuUQ_AUoAXoECAIQAw">
                            Nørre Boulevard 98, 1. tv. 4600 Køge.</a>
                        </td>
                    </tr>
                </table>
            </div>
        </section>
        <section id="footer_mid">
            <div class="wrapper">
                <p class="body_text">Established 2022</p>
            </div>
        </section>
        <section id="footer_right">
            <div class="wrapper">
                <h4 class="description">Links</h4>
                <ul id="footer_links">
                    <li>
                        <a href="https://facebook.com/bandwich/"><i class="fa-brands fa-facebook"></i></a>
                    </li>
                </ul>
            </div>
        </section>
    </div>
    `;
}