using MyNote.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyNote.API.Controllers
{
    public class NotesController : BaseApiController
    {
        [HttpGet]
        public IQueryable<Note> List()
        {
            //IHttpActionResult  List()
            //return Ok(db.Notes.Select(x => new NoteDTO { Baslik = x.Title, Yazar = x.Author.Email }).ToList());
            return db.Notes;
        }
    }

    //public class NoteDTO
    //{
    //    public string Baslik { get; set; }
    //    public string Yazar { get; set; }
    //}

}

