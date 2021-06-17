using Rg.Plugins.Popup.Services;
using System;
using System.Windows.Input;
using TheOxbridgeApp.Data;
using TheOxbridgeApp.Models;
using TheOxbridgeApp.Services;
using TheOxbridgeApp.Views;
using TheOxbridgeApp.Views.Popups;
using Xamarin.Forms;

namespace TheOxbridgeApp.ViewModels
{
    class LoginViewModel : BaseViewModel
    {
        #region -- Local variables --
        private ServerClient serverClient;
        private DataController dataController;
        private SingletonSharedData sharedData;
        #endregion

        #region -- Commands --
        public ICommand LoginCMD { get; set; }
        public ICommand EntryFocusedCommand { get; set; }
        public ICommand LoginClickedCMD { get; set; }
        public ICommand ResetPasswordCMD { get; set; }
        #endregion

        #region -- Binding values --
        private bool wrongLoginVisibility;
        public bool WrongLoginVisibility
        {
            get { return wrongLoginVisibility; }
            set { wrongLoginVisibility = value; OnPropertyChanged(); }
        }

        private String username;
        public String Username
        {
            get { return username; }
            set { username = value; OnPropertyChanged(); }
        }

        private String password;
        public String Password
        {
            get { return password; }
            set { password = value; OnPropertyChanged(); }
        }

        #endregion

        public LoginViewModel()
        {
            try
            {
                serverClient = new ServerClient();
                sharedData = SingletonSharedData.GetInstance();
                dataController = new DataController();

                LoginCMD = new Command(Login);
                EntryFocusedCommand = new Command(EntryFocused);
                LoginClickedCMD = new Command(Login);
                ResetPasswordCMD = new Command(ResetPassword);
            } catch (Exception e)
            {
                Console.WriteLine("LoginViewmodel init error");
            }
        }

        /// <summary>
        /// Authenticates the user and if it success, it saves the user securely and navigates to the EventView
        /// </summary>
        private async void Login()
        {
            await PopupNavigation.PushAsync(new LoadingPopupView()).ConfigureAwait(false);
            User user = new User();
            serverClient.Login(username, password);
            Console.WriteLine();
            if (user != null)
            {
                user.password = password;
                user.email = username;
                dataController.SaveUser(user);
                ((MasterDetailViewModel)((MasterDetail)Application.Current.MainPage).BindingContext).OnAppearing();
                await NavigationService.NavigateToAsync(typeof(EventViewModel));
            }
            else
            {
                WrongLoginVisibility = true;
                PopupNavigation.PopAllAsync();
            }
            Console.WriteLine(user.email);
        }

        //implemented calling of serverClient for resetpassword method on buttoncommand here
        private async void ResetPassword()
        {
            String response = serverClient.ResetPassword(username);
            await App.Current.MainPage.DisplayAlert("Reset Password Result", response, "OK");
        }

        private void EntryFocused()
        {
            WrongLoginVisibility = false;
        }
    }
}
