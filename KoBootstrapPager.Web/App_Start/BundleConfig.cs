using System.Web.Optimization;

namespace Pagination.Web {
    public class BundleConfig {

        public void DoSomething(string fileName)
{
  using (var stream = System.IO.File.Open(fileName,  System.IO.FileMode.Open))
  {
    var result = new byte[stream.Length];
    stream.Read(result, 0, (int)stream.Length); // Noncompliant
    // ... do something with result
  }
}

        public static void Register(BundleCollection bundles) {
            bundles.UseCdn = true;

            bundles.Add(new StyleBundle("~/content/normalize")
                .Include("~/content/normalize.css"));

            bundles.Add(new StyleBundle("~/content/bootstrap",
                "//ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/css/bootstrap.css")
                .Include("~/content/bootstrap.css"));

            bundles.Add(new StyleBundle("~/content/site")
                .Include(
                "~/content/font-awesome.css",
                "~/content/toastr.css",
                "~/css/main.css"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr", "//ajax.aspnetcdn.com/ajax/modernizr/modernizr-2.6.2.js")
                .Include("~/scripts/modernizr-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery", "//ajax.aspnetcdn.com/ajax/jQuery/jquery-3.1.1.min.js")
                .Include("~/scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout", "//ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js")
                .Include("~/scripts/knockout-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/libs")
               .Include(
                "~/scripts/knockout.mapping-latest.js",
               "~/scripts/toastr.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap", "//ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/bootstrap.min.js")
                .Include("~/scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/app1")
                .IncludeDirectory("~/mvvm/app1", "*-ts.js", true));

            bundles.Add(new ScriptBundle("~/bundles/app2")
                .IncludeDirectory("~/mvvm/app2", "*-ts.js", true));
        }
    }
}