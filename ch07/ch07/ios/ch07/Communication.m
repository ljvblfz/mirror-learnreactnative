//
//  Communication.m
//  ch07
//
//  Created by yuanlin on 2017/2/13.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "Communication.h"
#import "CommunicationViewController.h"
#import "AppDelegate.h"

@implementation Communication

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(presentViewControllerFromReactNative:(NSString *)params) {
  CommunicationViewController *communicationViewController = [[CommunicationViewController alloc] init];
  communicationViewController.params = params;
  
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  UIViewController *rootViewContoller = (UIViewController *)[[app window] rootViewController];
  
  [rootViewContoller presentViewController:communicationViewController animated:YES completion:nil];
}

@end
