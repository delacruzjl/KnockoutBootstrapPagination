using System.Web.Optimization;

namespace Pagination.Web {
    public class BundleConfig {
        public static void Register(BundleCollection bundles) {
            bundles.UseCdn = true;

            bundles.Add(new StyleBundle("~/content/normalize")
                .Include("~/content/normalize.css"));

            bundles.Add(new StyleBundle("~/content/bootstrap",
                "//ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/css/bootstrap.css")
                .Include("~/content/bootstrap.css"));

            bundles.Add(new StyleBundle("~/content/site")
                .Include("~/css/main.css"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr", "//ajax.aspnetcdn.com/ajax/modernizr/modernizr-2.6.2.js")
                .Include("~/scripts/modernizr-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery", "//ajax.aspnetcdn.com/ajax/jQuery/jquery-3.1.1.min.js")
                .Include("~/scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout", "//ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js")
                .Include("~/scripts/knockout-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap", "//ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/bootstrap.min.js")
                .Include("~/scripts/knockout-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/app")
                .IncludeDirectory("~/mvvm/", "*-ts.js", true));
        }
    }
}