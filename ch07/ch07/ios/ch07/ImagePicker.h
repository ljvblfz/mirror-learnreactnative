//
//  ImagePicker.h
//  ch07
//
//  Created by yuanlin on 2017/2/10.
//  Copyright © 2017年 Facebook. All rights reserved.
//


#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

@interface ImagePicker : NSObject <RCTBridgeModule, UINavigationControllerDelegate, UIImagePickerControllerDelegate>

@end
