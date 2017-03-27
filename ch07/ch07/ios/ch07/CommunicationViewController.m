//
//  CommunicationViewController.m
//  ch07
//
//  Created by yuanlin on 2017/2/13.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CommunicationViewController.h"

@interface CommunicationViewController ()

@end

@implementation CommunicationViewController

#pragma mark - Lifecycle

- (void)viewDidLoad {
  [super viewDidLoad];
  
  self.view.backgroundColor = [UIColor whiteColor];
  
  UITextView *textView = [[UITextView alloc] initWithFrame:CGRectMake(20, 20, 200, 40)];
  textView.text = @"原生界面";
  [textView setFont:[UIFont systemFontOfSize:20]];
  [self.view addSubview:textView];
  
  UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
  button.frame = CGRectMake(20, 60, 60, 40);
  [button setTitle:@"退出" forState:UIControlStateNormal];
  [button addTarget:self action:@selector(buttonOnClicked:) forControlEvents:UIControlEventTouchUpInside];
  [self.view addSubview:button];
}

- (void)viewDidAppear:(BOOL)animated {
  [super viewDidAppear:animated];
  
  UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"从React Native传来的数据是:" message:self.params preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil];
  [alertController addAction:cancelAction];
  [self presentViewController:alertController animated:YES completion:nil];
}

#pragma mark - IBActions

- (void)buttonOnClicked:(UIButton *)button {
  [self dismissViewControllerAnimated:YES completion:nil];
}

@end
