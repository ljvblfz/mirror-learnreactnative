//
//  Platform.m
//  ch06
//
//  Created by yuanlin on 2017/2/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "Platform.h"

@implementation Platform

RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport {
  return @{
           @"systemName": @"ios"
           };
}

@end
