using MyNoteDesktop.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MyNoteDesktop
{
    public partial class Form1 : Form
    {
        // https://www.tutorialsteacher.com/webapi/consuming-web-api-in-dotnet-using-httpclient
        // https://docs.microsoft.com/en-us/aspnet/web-api/overview/advanced/calling-a-web-api-from-a-net-client
        // https://stackoverflow.com/questions/37702013/webapi2-0-owin-token-request-using-json
        // https://stackoverflow.com/questions/29801195/adding-headers-when-using-httpclient-getasync/40707446#40707446

        HttpClient client = new HttpClient();

        private string ApiUrl => "https://mynoteapi.berkaysezer.com/";
        private string UserName => txtUserName.Text;
        private string Password => txtPassword.Text;


        public Form1()
        {
            client.BaseAddress = new Uri(ApiUrl);
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private async void btnListNotes_Click(object sender, EventArgs e)
        {
            string token = await GetTokenAsync();

            if (token == null)
            {
                MessageBox.Show("Kullanıcı veya paralo yanlış!");
                return;
            }

            List<Note> notes = await GetNote(token);
            lstNotes.DataSource = notes;
            lstNotes.DisplayMember = "Title";
        }

        private async Task<List<Note>> GetNote(string token)
        {


            using (var requestMessage = new HttpRequestMessage(HttpMethod.Get, "api/Notes/List"))
            {
                requestMessage.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                var response = await client.SendAsync(requestMessage);

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsAsync<List<Note>>();
                }
            }

            return null;
        }

        private async Task<string> GetTokenAsync()
        {

            var content = new FormUrlEncodedContent(new[]
            {
                    new KeyValuePair<string, string>("grant_type", "password"),
                    new KeyValuePair<string, string>("username", UserName),
                    new KeyValuePair<string, string>("password", Password)
                });

            HttpResponseMessage response = await client.PostAsync("Token", content);

            if (response.IsSuccessStatusCode)
            {
                IdentityToken identityToken = await response.Content.ReadAsAsync<IdentityToken>();
                return identityToken.AccessToken;
            }

            return null;


        }

        private void lstNotes_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (lstNotes.SelectedIndex > -1)
            {
                var note = lstNotes.SelectedItem as Note;
                txtNote.Text = note.Content;
            }
        }
    }
}
