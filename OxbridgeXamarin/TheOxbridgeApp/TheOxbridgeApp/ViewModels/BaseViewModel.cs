using System;
using System.Threading.Tasks;
using TheOxbridgeApp.Services;
using Xamarin.Forms;

namespace TheOxbridgeApp.ViewModels
{
    public abstract class BaseViewModel : BindableObject
    {
        #region -- Local variables --
        protected readonly INavigationService NavigationService;
        internal static String UserName = "";
        #endregion

        public BaseViewModel()
        {
            try
            {
                NavigationService = ViewModelLocator.Resolve<INavigationService>();
            } catch (Exception e)
            {
                Console.WriteLine("baseviewmodel init error");
            }            
        }

        public virtual Task InitializeAsync(object navigationData)
        {
            return Task.FromResult(false);
        }
    }
}
