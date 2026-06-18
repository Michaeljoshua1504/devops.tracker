#!/bin/bash

# ============================
# Server Health Check
# Written by : Michael
# Purpose: Check basic system health
# ============================


echo "==========================="
echo "  SYSTEM HEALTH REPORT"
echo "==========================="

# Check 1: Current date and time
echo ""
echo "Timestamp:"
date


#Check 2: Who is logged in
echo ""
echo "Logged in as:"
whoami

#Check 3: How long the system has been running
echo ""
echo "System uptime:"
Uptime

#Check 4: Disk space remaining
echo ""
echo "Disk Space:"
df -h /

#Check 5: Memory usage
echo ""
echo "Memory usage:"
free -h 2>/dev/null || vm_stat | head -5

echo ""
echo "=================================="
echo "    END OF REPORT "
echo "=================================="
