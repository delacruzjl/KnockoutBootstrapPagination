using System.Linq;
using System.Xml.Schema;
using Microsoft.AspNetCore.Mvc;

namespace Pagination.Web.Controllers {
    public class AppController : Controller
    {
        public ViewResult Index() {
            return View();
        }

        public JsonResult Data(int page = 1, int size = 10) {
            var p = page - 1;
            p = p < 0 ? 0 : p;

            var fakes = Enumerable.Range(1, 800)
                .Select(idx => new {
                    Id = idx,
                    Text = "Sample text for Id " + idx
                })
                .AsParallel()
                .ToList();

            var output = new {
                Total = fakes.Count,
                Rows = fakes.OrderBy(_ => _.Id)
                    .Skip(p* size)
                    .Take(size)
            };

            return Json(output);
        }
    }
}