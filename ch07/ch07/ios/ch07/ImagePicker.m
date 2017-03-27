#import "ImagePicker.h"

#import <React/RCTConvert.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <AVFoundation/AVFoundation.h>
#import <Photos/Photos.h>

typedef NS_ENUM(NSInteger, ImagePickerTarget) {
  ImagePickerTargetImage = 0,
  ImagePickerTargetCamera
};

@import MobileCoreServices;

@interface ImagePicker ()

@property (nonatomic, retain) NSMutableDictionary *options, *response;
@property (nonatomic, strong) RCTResponseSenderBlock callback;
@property (nonatomic, strong) UIImagePickerController *picker;
@property (nonatomic, strong) UIAlertController *alertController;

@end

@implementation ImagePicker

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(launchImageLibrary:(NSDictionary *)options callback:(RCTResponseSenderBlock)callback) {
  self.callback = callback;
  
  // 创建UIAlertController
  self.alertController = [UIAlertController alertControllerWithTitle:@"照片库" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
  UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * action) {
    self.callback(@[@{@"didCancel": @YES}]);
  }];
  [self.alertController addAction:cancelAction];
  UIAlertAction *takePhotoAction = [UIAlertAction actionWithTitle:@"相册" style:UIAlertActionStyleDefault handler:^(UIAlertAction * action) {
    [self launchImagePicker:ImagePickerTargetImage options:options];
  }];
  [self.alertController addAction:takePhotoAction];
  UIAlertAction *chooseFromLibraryAction = [UIAlertAction actionWithTitle:@"相机" style:UIAlertActionStyleDefault handler:^(UIAlertAction * action) {
    [self launchImagePicker:ImagePickerTargetCamera options:options];
  }];
  [self.alertController addAction:chooseFromLibraryAction];

  // 打开UIAlertController
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [root presentViewController:self.alertController animated:YES completion:nil];
  });
}

RCT_EXPORT_METHOD(launchImagePicker:(ImagePickerTarget)target options:(NSDictionary *)options) {
  self.options = [NSMutableDictionary dictionaryWithDictionary:options];
  
  // 创建UIImagePickerController
  self.picker = [[UIImagePickerController alloc] init];
  if (target == ImagePickerTargetImage) {
    self.picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
  } else if (target == ImagePickerTargetCamera) {
#if TARGET_IPHONE_SIMULATOR
    self.callback(@[@{@"error": @"Camera not available on simulator"}]);
    return;
#else
    self.picker.sourceType = UIImagePickerControllerSourceTypeCamera;
#endif
  }
  self.picker.mediaTypes = @[(NSString *)kUTTypeImage];
  self.picker.modalPresentationStyle = UIModalPresentationCurrentContext;
  self.picker.delegate = self;

  void (^showPickerViewController)() = ^void() {
    // 打开UIImagePickerController
    dispatch_async(dispatch_get_main_queue(), ^{
      UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
      while (root.presentedViewController != nil) {
        root = root.presentedViewController;
      }
      [root presentViewController:self.picker animated:YES completion:nil];
    });
  };
  
  if (target == ImagePickerTargetImage) {
    // 获取相册权限
    [self checkCameraPermissions:^(BOOL granted) {
      if (!granted) {
        self.callback(@[@{@"error": @"Camera permissions not granted"}]);
        return;
      }
      
      showPickerViewController();
    }];
  } else if (target == ImagePickerTargetCamera) {
    // 获取相机权限
    [self checkPhotosPermissions:^(BOOL granted) {
      if (!granted) {
        self.callback(@[@{@"error": @"Photo library permissions not granted"}]);
        return;
      }
      
      showPickerViewController();
    }];
  }
}

#pragma mark - UIImagePickerControllerDelegate

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info {
  UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
  
  // 图片缩放
  float maxWidth = image.size.width;
  float maxHeight = image.size.height;
  if ([self.options valueForKey:@"maxWidth"]) {
    maxWidth = [[self.options valueForKey:@"maxWidth"] floatValue];
  }
  if ([self.options valueForKey:@"maxHeight"]) {
    maxHeight = [[self.options valueForKey:@"maxHeight"] floatValue];
  }
  image = [self downscaleImageIfNecessary:image maxWidth:maxWidth maxHeight:maxHeight];
  
  // 设置图片路径
  NSString *fileName;
  if ([[[self.options objectForKey:@"imageFileType"] stringValue] isEqualToString:@"png"]) {
    fileName = [[[NSUUID UUID] UUIDString] stringByAppendingString:@".png"];
  } else {
    fileName = [[[NSUUID UUID] UUIDString] stringByAppendingString:@".jpg"];
  }
  NSString *path = [[NSTemporaryDirectory()stringByStandardizingPath] stringByAppendingPathComponent:fileName];
  NSData *data = UIImageJPEGRepresentation(image, [[self.options valueForKey:@"quality"] floatValue]);
  [data writeToFile:path atomically:YES];
  
  self.response = [[NSMutableDictionary alloc] init];
  
  // 设置图片uri
  NSURL *fileURL = [NSURL fileURLWithPath:path];
  NSString *filePath = [fileURL absoluteString];
  [self.response setObject:filePath forKey:@"uri"];
  
  // 设置图片大小
  NSNumber *fileSizeValue = nil;
  NSError *fileSizeError = nil;
  [fileURL getResourceValue:&fileSizeValue forKey:NSURLFileSizeKey error:&fileSizeError];
  if (fileSizeValue){
    [self.response setObject:fileSizeValue forKey:@"fileSize"];
  }
  
  // 回调函数
  self.callback(@[self.response]);
  
  // 关闭UIImagePickerController
  [picker dismissViewControllerAnimated:YES completion:nil];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
  // 回调函数
  self.callback(@[@{@"didCancel": @YES}]);
  
  // 关闭UIImagePickerController
  [picker dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - Helpers

- (void)checkPhotosPermissions:(void(^)(BOOL granted))callback {
  PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
  if (status == PHAuthorizationStatusAuthorized) {
    callback(YES);
    return;
  } else if (status == PHAuthorizationStatusNotDetermined) {
    [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
      if (status == PHAuthorizationStatusAuthorized) {
        callback(YES);
        return;
      } else {
        callback(NO);
        return;
      }
    }];
  } else {
    callback(NO);
  }
}

- (void)checkCameraPermissions:(void(^)(BOOL granted))callback {
  AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
  if (status == AVAuthorizationStatusAuthorized) {
    callback(YES);
    return;
  } else if (status == AVAuthorizationStatusNotDetermined){
    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
      callback(granted);
      return;
    }];
  } else {
    callback(NO);
  }
}

- (UIImage*)downscaleImageIfNecessary:(UIImage*)image maxWidth:(float)maxWidth maxHeight:(float)maxHeight {
  UIImage* newImage = image;
  if (image.size.width <= maxWidth && image.size.height <= maxHeight) {
    return newImage;
  }
  
  // 计算大小
  CGSize scaledSize = CGSizeMake(image.size.width, image.size.height);
  if (maxWidth < scaledSize.width) {
    scaledSize = CGSizeMake(maxWidth, (maxWidth / scaledSize.width) * scaledSize.height);
  }
  if (maxHeight < scaledSize.height) {
    scaledSize = CGSizeMake((maxHeight / scaledSize.height) * scaledSize.width, maxHeight);
  }
  scaledSize.width = (int)scaledSize.width;
  scaledSize.height = (int)scaledSize.height;
  
  // 缩放图片
  UIGraphicsBeginImageContext(scaledSize);
  [image drawInRect:CGRectMake(0, 0, scaledSize.width, scaledSize.height)];
  newImage = UIGraphicsGetImageFromCurrentImageContext();
  if (newImage == nil) {
    NSLog(@"could not scale image");
  }
  UIGraphicsEndImageContext();
  
  return newImage;
}

@end
