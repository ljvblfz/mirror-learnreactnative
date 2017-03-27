//
//  ViewController.m
//  AddReactNativeToIOS
//
//  Created by yuanlin on 2017/2/15.
//  Copyright © 2017年 com.learnreactnative. All rights reserved.
//

#import "ViewController.h"
#import <RCTRootView.h>

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSString *strUrl = @"http://localhost:8081/index.ios.bundle?platform=ios&dev=true";
    NSURL *jsCodeLocation = [NSURL URLWithString:strUrl];
#ifndef DEBUG
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation moduleName:@"AddReactNativeToIOS" initialProperties:nil launchOptions:nil];
    rootView.frame = self.view.bounds;
    [self.view addSubview:rootView];
}

@end
