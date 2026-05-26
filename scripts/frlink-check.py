#!/usr/bin/env python3
"""
python 友链状态检测脚本
"""

import sys
import time
import json
import argparse
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any

import requests
import yaml
import os

# 在控制台输出
COLOR = {
    "green": "\033[92m",
    "yellow": "\033[93m",
    "orange": "\033[38;5;208m",
    "red": "\033[91m",
    "reset": "\033[0m",
}

THRESHOLDS = [(1.0, "流畅", "green"), (2.0, "正常", "yellow"), (3.0, "较慢", "orange")]


def load_yaml(file_path: str) -> List[Dict[str, Any]]:
    """加载 YAML 文件"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        if not isinstance(data, list):
            raise ValueError("YAML 根节点应为列表（多个分组）")
        return data
    except Exception as e:
        print(f"错误：无法读取 YAML 文件 '{file_path}'\n{e}")
        sys.exit(1)


def check_link(url: str, timeout: float = 5.0) -> Tuple[bool, Optional[float], Optional[int], str]:
    """检测单个链接，返回 (是否成功, 耗时秒数, HTTP状态码, 错误信息)"""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    try:
        start = time.perf_counter()
        resp = requests.get(url, timeout=timeout, allow_redirects=True)
        end = time.perf_counter()
        elapsed = end - start
        success = resp.status_code < 400
        return success, elapsed, resp.status_code, ""
    except requests.exceptions.Timeout:
        return False, None, None, "请求超时"
    except requests.exceptions.ConnectionError:
        return False, None, None, "连接失败"
    except requests.exceptions.SSLError:
        return False, None, None, "SSL 证书错误"
    except Exception as e:
        return False, None, None, str(e)


def get_level(elapsed: float) -> Tuple[str, str]:
    """根据耗时返回 (等级名称, 颜色名)"""
    for threshold, level, color in THRESHOLDS:
        if elapsed < threshold:
            return level, color
    return "非常慢", "red"


def format_time(seconds: float) -> str:
    return f"{seconds:.2f}s"


def print_colored(text: str, color: str, end="\n", flush=True):
    print(f"{COLOR.get(color, '')}{text}{COLOR['reset']}", end=end, flush=flush)


def print_single_link_result(group_name: str, idx: int, link_result: Dict[str, Any]):
    """控制台输出链接的检测结果"""
    name = link_result["name"]
    url = link_result["url"]
    if link_result["success"]:
        status_code = link_result["status_code"]
        elapsed = link_result["elapsed"]
        level = link_result["level"]
        color = link_result["color"]
        print_colored(
            f"  {idx}. {name} ({url})\n      → HTTP {status_code} | {format_time(elapsed)} | {level}",
            color, flush=True
        )
    else:
        error = link_result.get("error", "未知错误")
        print_colored(f"  {idx}. {name} ({url})\n      → 失败：{error}", "red", flush=True)


def run_checks(groups: List[Dict[str, Any]], timeout: float) -> Dict[str, Any]:
    """
        开始检测，同时控制台输出检测结果
    """
    result = {
        "timestamp": datetime.now().isoformat(),
        "timeout": timeout,
        "groups": []
    }

    for group in groups:
        group_name = group.get("name", "未命名分组")
        should_check = group.get("check") is not False  # 默认为 True
        group_result = {
            "name": group_name,
            "checked": should_check,
            "links": []
        }

        # 输出分组头部信息
        if should_check:
            link_list = group.get("link-list", [])
            if link_list:
                print_colored(f"\n[{group_name}] 开始检测 {len(link_list)} 个链接", "green", flush=True)
                print("-" * 60, flush=True)
            else:
                print_colored(f"\n[{group_name}] 没有链接", "yellow", flush=True)
        else:
            print_colored(f"\n[{group_name}] 已跳过检测 (check: false)", "yellow", flush=True)

        if not should_check:
            result["groups"].append(group_result)
            continue

        link_list = group.get("link-list", [])
        for idx, link_info in enumerate(link_list, 1):
            name = link_info.get("name", "未命名")
            url = link_info.get("link", "")
            link_result = {
                "name": name,
                "url": url,
                "success": False,
                "elapsed": None,
                "status_code": None,
                "level": None,
                "color": None,
                "error": None,
            }

            if not url:
                link_result["error"] = "缺少 link 字段"
                group_result["links"].append(link_result)
                print_single_link_result(group_name, idx, link_result)
                continue

            success, elapsed, status_code, error = check_link(url, timeout=timeout)

            if success:
                level, color = get_level(elapsed)
                link_result.update({
                    "success": True,
                    "elapsed": round(elapsed, 3),
                    "status_code": status_code,
                    "level": level,
                    "color": color,
                    "error": None,
                })
            else:
                link_result["error"] = error

            group_result["links"].append(link_result)
            print_single_link_result(group_name, idx, link_result)

        if link_list:
            print("-" * 60, flush=True)

        result["groups"].append(group_result)

    return result


def save_json_files(data: Dict[str, Any], base_path: str):
    """
    输出格式化和压缩版的结果 (json 格式)
    """
    
    dir_name = os.path.dirname(base_path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)

    # 格式化结果
    try:
        with open(base_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print_colored(f"\n✅ 完整 JSON 报告已保存至: {base_path}", "green", flush=True)
    except Exception as e:
        print_colored(f"\n❌ 保存完整 JSON 文件失败: {e}", "red", flush=True)
        return

    # 压缩版结果, 文件名后添加 -min
    if '.' in base_path:
        base_name, ext = base_path.rsplit('.', 1)
        minified_path = f"{base_name}-min.{ext}"
    else:
        minified_path = f"{base_path}-min"
    try:
        with open(minified_path, "w", encoding="utf-8") as f:
            json.dump(data, f, separators=(',', ':'), ensure_ascii=False)
        print_colored(f"✅ 压缩 JSON 报告已保存至: {minified_path}", "green", flush=True)
    except Exception as e:
        print_colored(f"❌ 保存压缩 JSON 文件失败: {e}", "red", flush=True)


def main():
    parser = argparse.ArgumentParser(description="检测友链状态并输出 json 格式的检测结果")
    parser.add_argument("-f", "--file", default="friend-links.yaml", help="友链数据路径")
    parser.add_argument("-t", "--timeout", type=float, default=5.0, help="请求超时时间（秒）")
    parser.add_argument("-o", "--output-json", default="result.json", help="完整 JSON 输出路径(默认: result.json)，压缩版自动在同目录生成 -min 文件")
    args = parser.parse_args()

    groups = load_yaml(args.file)
    result = run_checks(groups, args.timeout)
    save_json_files(result, args.output_json)


if __name__ == "__main__":
    main()
