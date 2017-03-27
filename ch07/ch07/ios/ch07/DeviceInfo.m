//
//  DeviceInfo.m
//  ch07
//
//  Created by yuanlin on 2017/2/10.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "DeviceInfo.h"
#import <UIKit/UIKit.h>

@implementation DeviceInfo

RCT_EXPORT_MODULE() // 导出此原生模块供React Native接口调用

- (NSDictionary *)constantsToExport {
  UIDevice *currentDevice = [UIDevice currentDevice];
  
  return @{
           @"systemName": currentDevice.systemName,
           @"systemVersion": currentDevice.systemVersion,
           @"deviceLocale": self.deviceLocale,
           @"appVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"],
           };
}

- (NSString *)deviceLocale {
  NSString *language = [[NSLocale preferredLanguages] objectAtIndex:0];
  return language;
}

- (NSString *)deviceCountry {
  NSString *country = [[NSLocale currentLocale] objectForKey:NSLocaleCountryCode];
  return country;
}

@end


