using System;
using System.Windows.Input;
using Xamarin.Forms;
using Plugin.Media;
using Plugin.Media.Abstractions;
using Xamarin.Essentials;
using System.ComponentModel;
using System.IO;
using TheOxbridgeApp.Models;
using System.Runtime.CompilerServices;

namespace TheOxbridgeApp.ViewModels
{    
    class AccountPageViewModel : BaseViewModel
    {
        public event PropertyChangedEventHandler PropertyChanged;
        public void RaisePropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        private String errorMsg;

        public String ErrorMsg
        {
            get { return errorMsg; }
            set
            {
                errorMsg = value;
                RaisePropertyChanged();
            }
        }

        private UserPhoto userPhoto = null;

        public UserPhoto UserPhoto
        {
            get { return userPhoto; }
            set { userPhoto = value; RaisePropertyChanged(); }
        }

        public bool isBusy = false;

        public ICommand NavigateCMD => new Command(() =>
        {

            if (isBusy)
                return;
            isBusy = true;
            ErrorMsg = "";

            App.userPhoto = UserPhoto;

            //App.Current.MainPage = new ShowPictureView();
        });



        public ICommand CameraCMD => new Command<Image>(async (Image profilImage) => {

            if (isBusy)
                return;
            isBusy = true;
            ErrorMsg = "";

            UserPhoto userPhotoTmp = new UserPhoto();

            try
            {
                if (!Plugin.Media.CrossMedia.Current.IsCameraAvailable ||
                    !Plugin.Media.CrossMedia.Current.IsTakePhotoSupported)
                {
                    System.Diagnostics.Debug.WriteLine("No camera available. ");
                    ErrorMsg = "No camera available. ";
                    isBusy = false;
                    return;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("ex.Message: " + ex.Message);
                isBusy = false;
                return;
            }

            DateTime dt = DateTime.Now;
            string createdDate = dt.Year.ToString("d4") + dt.Month.ToString("d2") + dt.Day.ToString("d2");
            string photoName = String.Format("profil_{0}.jpg", createdDate);

            var photo = await Plugin.Media.CrossMedia.Current.TakePhotoAsync(new Plugin.Media.Abstractions.StoreCameraMediaOptions()
            { SaveToAlbum = true, Name = photoName, PhotoSize = PhotoSize.Medium, AllowCropping = false, SaveMetaData = false });

            if (photo != null)
            {
                using (photo)
                {
                    using (var memoryStreamHandler = new MemoryStream())
                    {
                        photo.GetStreamWithImageRotatedForExternalStorage().CopyTo(memoryStreamHandler);

                        userPhotoTmp.Picture = memoryStreamHandler.ToArray();
                        UserPhoto = userPhotoTmp;
                    }


                }
            }
            isBusy = false;
        });

        public AccountPageViewModel()
        {
            UserPhoto = App.userPhoto;
            //CameraCMD = new Command(OpenCamera);
            //PickCMD = new Command(PickProfilePicture);
            //ResultImage = ImageSource.FromFile("userImg.jpg");
        }

        private async void OpenCamera()
        {
        }

        //async void PickProfilePicture()
        //{
        //    var result = MediaPicker.PickPhotoAsync(new MediaPickerOptions
        //    {
        //        Title = "Please pick a photo",

        //    });

        //    var stream = await result.();
        //    ResultImage = ImageSource.FromStream(() => { stream});
        //}
    }
}
