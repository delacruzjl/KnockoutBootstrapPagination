using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Pagination.Web.Controllers
{
    public class ClinController : Controller
    {
        public ViewResult Index()
        {
            return View();
        }
    }
}
