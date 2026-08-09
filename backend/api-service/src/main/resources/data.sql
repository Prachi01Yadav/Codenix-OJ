-- =====================================================
-- Seed Data: 25 problems + test cases
-- Login-able accounts created by DataSeeder.java
-- =====================================================

-- Admin user placeholder (FK reference for problems.created_by)
-- Actual login handled by DataSeeder with correct BCrypt hash
MERGE INTO users (id, name, email, handle, password_hash, role, rating, max_rating, created_at)
KEY (id)
VALUES (UUID '550e8400-e29b-41d4-a716-446655440000', 'Admin', 'admin@algou.dev', 'admin',
        '$2a$10$placeholder', 'ADMIN', 2500, 2500, NOW());

-- =====================================================
-- PROBLEMS
-- =====================================================

MERGE INTO problems (id, title, slug, statement, difficulty, constraints, input_format, output_format, time_limit_ms, memory_limit_mb, total_submissions, accepted_submissions, created_by, created_at, updated_at)
KEY (id)
VALUES
(1, 'Two Sum', 'two-sum',
 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.',
 'EASY', '2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
Only one valid answer exists.',
 'First line: n (size of array)
Second line: n space-separated integers
Third line: target value',
 'Two space-separated integers representing the indices.',
 1000, 256, 482000, 429000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(2, 'Add Two Numbers', 'add-two-numbers',
 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
 'MEDIUM', 'The number of nodes in each linked list is in the range [1, 100].
0 <= Node.val <= 9',
 'First line: n (size of first list)
Second line: n space-separated digits of the first linked list in reverse order.
Third line: m (size of second list)
Fourth line: m space-separated digits of the second linked list in reverse order.',
 'Space-separated digits of the result linked list in reverse order.',
 1000, 256, 312000, 130000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(3, 'Longest Substring Without Repeating Characters', 'longest-substring',
 'Given a string s, find the length of the longest substring without repeating characters.',
 'MEDIUM', '0 <= s.length <= 5 * 10^4
s consists of English letters, digits, symbols and spaces.',
 'A single string s.',
 'A single integer — the length of the longest substring.',
 1000, 256, 298000, 102000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(4, 'Median of Two Sorted Arrays', 'median-two-sorted-arrays',
 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).',
 'HARD', 'nums1.length == m
nums2.length == n
0 <= m <= 1000
0 <= n <= 1000
1 <= m + n <= 2000',
 'First line: m n
Second line: m space-separated integers
Third line: n space-separated integers',
 'A single floating point number — the median.',
 1000, 256, 189000, 68000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(5, 'Longest Palindromic Substring', 'longest-palindromic-substring',
 'Given a string s, return the longest palindromic substring in s.',
 'MEDIUM', '1 <= s.length <= 1000
s consist of only digits and English letters.',
 'A single string s.',
 'The longest palindromic substring.',
 1000, 256, 256000, 79000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(6, 'Regular Expression Matching', 'regex-matching',
 'Given an input string s and a pattern p, implement regular expression matching with support for ''.'' and ''*'' where:
''.'' Matches any single character.
''*'' Matches zero or more of the preceding element.',
 'HARD', '1 <= s.length <= 20
1 <= p.length <= 20
s contains only lowercase English letters.
p contains only lowercase English letters, ''.'', and ''*''.',
 'Two lines: string s and pattern p.',
 'true or false',
 2000, 256, 145000, 39000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(7, 'Container With Most Water', 'container-water',
 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.',
 'MEDIUM', 'n == height.length
2 <= n <= 10^5
0 <= height[i] <= 10^4',
 'First line: n
Second line: n space-separated integers.',
 'A single integer — the maximum area.',
 1000, 256, 201000, 109000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(8, 'Three Sum', 'three-sum',
 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.',
 'MEDIUM', '3 <= nums.length <= 3000
-10^5 <= nums[i] <= 10^5',
 'First line: n
Second line: n space-separated integers.',
 'Each line contains a triplet of space-separated integers, sorted.',
 1000, 256, 278000, 97000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(9, 'Valid Parentheses', 'valid-parentheses',
 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.

An input string is valid if:
Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.
Every close bracket has a corresponding open bracket of the same type.',
 'EASY', '1 <= s.length <= 10^4
s consists of parentheses only.',
 'A single string s.',
 'true or false',
 1000, 256, 389000, 156000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(10, 'Merge K Sorted Lists', 'merge-k-sorted-lists',
 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.',
 'HARD', 'k == lists.length
0 <= k <= 10^4
0 <= lists[i].length <= 500
-10^4 <= lists[i][j] <= 10^4',
 'First line: k
Following k lines: each contains space-separated integers of a sorted list.',
 'Space-separated integers of the merged sorted list.',
 2000, 256, 167000, 87000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(11, 'Trapping Rain Water', 'trapping-rain-water',
 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
 'HARD', 'n == height.length
1 <= n <= 2 * 10^4
0 <= height[i] <= 10^5',
 'First line: n
Second line: n space-separated integers.',
 'A single integer — total water trapped.',
 1000, 256, 198000, 116000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(12, 'Word Break', 'word-break',
 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
 'MEDIUM', '1 <= s.length <= 300
1 <= wordDict.length <= 1000
1 <= wordDict[i].length <= 20',
 'First line: string s
Second line: space-separated dictionary words.',
 'true or false',
 1000, 256, 178000, 84000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(13, 'Binary Tree Inorder Traversal', 'binary-tree-inorder',
 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
 'EASY', 'The number of nodes in the tree is in the range [0, 100].
-100 <= Node.val <= 100',
 'Space-separated integers representing the tree in level-order (use -1 for null).',
 'Space-separated integers of the inorder traversal.',
 1000, 256, 256000, 189000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(14, 'Course Schedule', 'course-schedule',
 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

Return true if you can finish all courses.',
 'MEDIUM', '1 <= numCourses <= 2000
0 <= prerequisites.length <= 5000',
 'First line: numCourses numPrereqs
Following lines: ai bi pairs.',
 'true or false',
 1000, 256, 234000, 100000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(15, 'Number of Islands', 'number-of-islands',
 'Given an m x n 2D binary grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
 'MEDIUM', 'm == grid.length
n == grid[i].length
1 <= m, n <= 300
grid[i][j] is ''0'' or ''1''.',
 'First line: m n
Following m lines: n space-separated characters.',
 'A single integer — number of islands.',
 1000, 256, 312000, 179000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(16, 'Longest Increasing Path in Matrix', 'longest-increasing-path',
 'Given an m x n integers matrix, return the length of the longest increasing path in matrix.

From each cell, you can either move in four directions: left, right, up, or down.',
 'HARD', 'm == matrix.length
n == matrix[i].length
1 <= m, n <= 200
0 <= matrix[i][j] <= 2^31 - 1',
 'First line: m n
Following m lines: n space-separated integers.',
 'A single integer — length of the longest increasing path.',
 2000, 256, 98000, 51000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(17, 'Coin Change', 'coin-change',
 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up, return -1.',
 'MEDIUM', '1 <= coins.length <= 12
1 <= coins[i] <= 2^31 - 1
0 <= amount <= 10^4',
 'First line: n (number of coins)
Second line: n space-separated coin values
Third line: amount',
 'A single integer — minimum coins needed or -1.',
 1000, 256, 187000, 72000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(18, 'Edit Distance', 'edit-distance',
 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations: Insert a character, Delete a character, Replace a character.',
 'HARD', '0 <= word1.length, word2.length <= 500
word1 and word2 consist of lowercase English letters.',
 'Two lines: word1 and word2.',
 'A single integer — minimum edit distance.',
 1000, 256, 134000, 64000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(19, 'Kth Largest Element in Array', 'kth-largest-element',
 'Given an integer array nums and an integer k, return the kth largest element in the array.

Note that it is the kth largest element in the sorted order, not the kth distinct element.',
 'MEDIUM', '1 <= k <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4',
 'First line: n k
Second line: n space-separated integers.',
 'A single integer — the kth largest element.',
 1000, 256, 201000, 134000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(20, 'Valid Sudoku', 'valid-sudoku',
 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the rules:
Each row must contain the digits 1-9 without repetition.
Each column must contain the digits 1-9 without repetition.
Each of the nine 3 x 3 sub-boxes must contain the digits 1-9 without repetition.',
 'MEDIUM', 'board.length == 9
board[i].length == 9
board[i][j] is a digit 1-9 or ''.''.',
 '9 lines of 9 space-separated characters.',
 'true or false',
 1000, 256, 167000, 94000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(21, 'Reverse Linked List', 'reverse-linked-list',
 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
 'EASY', 'The number of nodes in the list is the range [0, 5000].
-5000 <= Node.val <= 5000',
 'Space-separated integers representing the linked list.',
 'Space-separated integers of the reversed list.',
 1000, 256, 298000, 226000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(22, 'Maximum Subarray', 'maximum-subarray',
 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
 'MEDIUM', '1 <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4',
 'First line: n
Second line: n space-separated integers.',
 'A single integer — the maximum subarray sum.',
 1000, 256, 245000, 123000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(23, 'Climbing Stairs', 'climbing-stairs',
 'You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
 'EASY', '1 <= n <= 45',
 'A single integer n.',
 'A single integer — the number of distinct ways.',
 1000, 256, 312000, 159000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(24, 'Word Search II', 'word-search-ii',
 'Given an m x n board of characters and a list of strings words, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.',
 'HARD', 'm == board.length
n == board[i].length
1 <= m, n <= 12
1 <= words.length <= 3 * 10^4',
 'First line: m n
Following m lines: n space-separated characters
Last line: space-separated words to find.',
 'Space-separated found words, sorted alphabetically.',
 2000, 512, 89000, 31000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(25, 'LRU Cache', 'lru-cache',
 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
LRUCache(int capacity) - Initialize the LRU cache with positive size capacity.
int get(int key) - Return the value of the key if it exists, otherwise return -1.
void put(int key, int value) - Update the value of the key if it exists. Otherwise, add the key-value pair to the cache.',
 'MEDIUM', '1 <= capacity <= 3000
0 <= key <= 10^4
0 <= value <= 10^5
At most 2 * 10^5 calls will be made to get and put.',
 'First line: capacity
Following lines: operation key [value]',
 'One line per get operation with the returned value.',
 1000, 256, 267000, 115000, UUID '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- =====================================================
-- TAGS
-- =====================================================

DELETE FROM problem_tags WHERE problem_id BETWEEN 1 AND 25;
INSERT INTO problem_tags (problem_id, tag) VALUES
(1, 'Arrays'), (1, 'Hashing'),
(2, 'Linked Lists'), (2, 'Math'),
(3, 'Strings'), (3, 'Sliding Window'),
(4, 'Arrays'), (4, 'Binary Search'),
(5, 'Strings'), (5, 'DP'),
(6, 'Strings'), (6, 'DP'),
(7, 'Arrays'), (7, 'Two Pointers'),
(8, 'Arrays'), (8, 'Two Pointers'),
(9, 'Stacks'), (9, 'Strings'),
(10, 'Linked Lists'), (10, 'Heaps'),
(11, 'Arrays'), (11, 'Two Pointers'), (11, 'DP'),
(12, 'DP'), (12, 'Strings'),
(13, 'Trees'), (13, 'DFS'),
(14, 'Graphs'), (14, 'BFS'), (14, 'DFS'),
(15, 'Graphs'), (15, 'DFS'), (15, 'BFS'),
(16, 'DP'), (16, 'Graphs'), (16, 'DFS'),
(17, 'DP'),
(18, 'DP'), (18, 'Strings'),
(19, 'Heaps'), (19, 'Arrays'),
(20, 'Arrays'), (20, 'Hashing'),
(21, 'Linked Lists'),
(22, 'Arrays'), (22, 'DP'),
(23, 'DP'), (23, 'Math'),
(24, 'Trie'), (24, 'DFS'), (24, 'Arrays'),
(25, 'Design'), (25, 'Hashing'), (25, 'Linked Lists');

-- =====================================================
-- SAMPLE TEST CASES (visible to users)
-- =====================================================

DELETE FROM test_cases WHERE problem_id BETWEEN 1 AND 25;

-- 1. Two Sum
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(1, '4
2 7 11 15
9', '0 1', true, 'Because nums[0] + nums[1] == 9, we return [0, 1].', 0),
(1, '3
3 2 4
6', '1 2', true, 'Because nums[1] + nums[2] == 6, we return [1, 2].', 1),
(1, '2
3 3
6', '0 1', false, null, 2),
(1, '5
1 5 3 7 2
8', '1 3', false, null, 3);

-- 2. Add Two Numbers
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(2, '3
2 4 3
3
5 6 4', '7 0 8', true, '342 + 465 = 807, stored in reverse as 7 0 8.', 0),
(2, '1
0
1
0', '0', true, '0 + 0 = 0.', 1),
(2, '7
9 9 9 9 9 9 9
4
9 9 9 9', '8 9 9 9 0 0 0 1', false, null, 2);

-- 3. Longest Substring Without Repeating Characters
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(3, 'abcabcbb', '3', true, 'The longest substring is "abc" with length 3.', 0),
(3, 'bbbbb', '1', true, 'The longest substring is "b" with length 1.', 1),
(3, 'pwwkew', '3', false, null, 2);

-- 4. Median of Two Sorted Arrays
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(4, '2 2
1 3
2 4', '2.50000', true, 'Merged array = [1,2,3,4], median = (2+3)/2 = 2.5.', 0),
(4, '1 2
1 2
3', '2.00000', true, 'Merged array = [1,2,3], median = 2.', 1),
(4, '1 1
2
1', '1.50000', false, null, 2);

-- 5. Longest Palindromic Substring
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(5, 'babad', 'bab', true, '"bab" is a palindrome of length 3. "aba" is also valid.', 0),
(5, 'cbbd', 'bb', true, '"bb" is the longest palindromic substring.', 1),
(5, 'a', 'a', false, null, 2);

-- 6. Regular Expression Matching
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(6, 'aa
a', 'false', true, '"a" does not match the entire string "aa".', 0),
(6, 'aa
a*', 'true', true, '"a*" means zero or more of "a", which matches "aa".', 1),
(6, 'ab
.*', 'true', false, null, 2);

-- 7. Container With Most Water
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(7, '9
1 8 6 2 5 4 8 3 7', '49', true, 'Lines at index 1 and 8 form the container with most water.', 0),
(7, '2
1 1', '1', true, 'Minimum case.', 1),
(7, '5
4 3 2 1 4', '16', false, null, 2);

-- 8. Three Sum
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(8, '6
-1 0 1 2 -1 -4', '-1 -1 2
-1 0 1', true, 'Two unique triplets that sum to zero.', 0),
(8, '3
0 1 1', '', true, 'No triplets sum to zero.', 1),
(8, '3
0 0 0', '0 0 0', false, null, 2);

-- 9. Valid Parentheses
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(9, '()', 'true', true, 'Simple matching pair.', 0),
(9, '()[]{}', 'true', true, 'All brackets are properly matched.', 1),
(9, '(]', 'false', true, 'Mismatched brackets.', 2),
(9, '([)]', 'false', false, null, 3),
(9, '{[]}', 'true', false, null, 4);

-- 10. Merge K Sorted Lists
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(10, '3
1 4 5
1 3 4
2 6', '1 1 2 3 4 4 5 6', true, 'Merge three sorted lists into one.', 0),
(10, '0', '', true, 'Empty input returns empty list.', 1),
(10, '1
1', '1', false, null, 2);

-- 11. Trapping Rain Water
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(11, '12
0 1 0 2 1 0 1 3 2 1 2 1', '6', true, '6 units of rain water are trapped.', 0),
(11, '6
4 2 0 3 2 5', '9', true, '9 units of rain water are trapped.', 1),
(11, '3
1 0 1', '1', false, null, 2);

-- 12. Word Break
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(12, 'leetcode
leet code', 'true', true, '"leetcode" can be segmented as "leet code".', 0),
(12, 'applepenapple
apple pen', 'true', true, '"applepenapple" = "apple" + "pen" + "apple".', 1),
(12, 'catsandog
cats dog sand and cat', 'false', false, null, 2);

-- 13. Binary Tree Inorder Traversal
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(13, '1 -1 2 3', '1 3 2', true, 'Inorder: left, root, right.', 0),
(13, '', '', true, 'Empty tree returns empty.', 1),
(13, '1', '1', false, null, 2);

-- 14. Course Schedule
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(14, '2 1
1 0', 'true', true, 'Take course 0 first, then course 1.', 0),
(14, '2 2
1 0
0 1', 'false', true, 'Circular dependency makes it impossible.', 1),
(14, '3 2
1 0
2 1', 'true', false, null, 2);

-- 15. Number of Islands
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(15, '4 5
1 1 1 1 0
1 1 0 1 0
1 1 0 0 0
0 0 0 0 0', '1', true, 'All 1s are connected, forming one island.', 0),
(15, '4 5
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1', '3', true, 'Three separate islands.', 1);

-- 16. Longest Increasing Path in Matrix
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(16, '3 3
9 9 4
6 6 8
2 1 1', '4', true, 'Longest path: 1 -> 2 -> 6 -> 9, length 4.', 0),
(16, '3 3
3 4 5
3 2 6
2 2 1', '4', true, 'Longest path: 1 -> 2 -> 3 -> 4, length 4.', 1);

-- 17. Coin Change
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(17, '3
1 2 5
11', '3', true, '11 = 5 + 5 + 1, minimum 3 coins.', 0),
(17, '1
2
3', '-1', true, 'Amount 3 cannot be made with only coin 2.', 1),
(17, '1
1
0', '0', false, null, 2);

-- 18. Edit Distance
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(18, 'horse
ros', '3', true, 'horse -> rorse -> rose -> ros (3 operations).', 0),
(18, 'intention
execution', '5', true, 'intention -> execution requires 5 operations.', 1),
(18, 'abc
abc', '0', false, null, 2);

-- 19. Kth Largest Element in Array
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(19, '6 2
3 2 1 5 6 4', '5', true, 'Sorted: [1,2,3,4,5,6]. 2nd largest is 5.', 0),
(19, '9 4
3 2 3 1 2 4 5 5 6', '4', true, 'Sorted: [1,2,2,3,3,4,5,5,6]. 4th largest is 4.', 1),
(19, '3 1
1 2 3', '3', false, null, 2);

-- 20. Valid Sudoku
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(20, '5 3 . . 7 . . . .
6 . . 1 9 5 . . .
. 9 8 . . . . 6 .
8 . . . 6 . . . 3
4 . . 8 . 3 . . 1
7 . . . 2 . . . 6
. 6 . . . . 2 8 .
. . . 4 1 9 . . 5
. . . . 8 . . 7 9', 'true', true, 'A valid Sudoku board.', 0),
(20, '8 3 . . 7 . . . .
6 . . 1 9 5 . . .
. 9 8 . . . . 6 .
8 . . . 6 . . . 3
4 . . 8 . 3 . . 1
7 . . . 2 . . . 6
. 6 . . . . 2 8 .
. . . 4 1 9 . . 5
. . . . 8 . . 7 9', 'false', true, 'Two 8s in the first column make it invalid.', 1);

-- 21. Reverse Linked List
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(21, '1 2 3 4 5', '5 4 3 2 1', true, 'Reverse the entire list.', 0),
(21, '1 2', '2 1', true, 'Two element list.', 1),
(21, '1', '1', false, null, 2);

-- 22. Maximum Subarray
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(22, '9
-2 1 -3 4 -1 2 1 -5 4', '6', true, 'Subarray [4,-1,2,1] has the largest sum = 6.', 0),
(22, '1
1', '1', true, 'Single element.', 1),
(22, '5
5 4 -1 7 8', '23', false, null, 2);

-- 23. Climbing Stairs
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(23, '2', '2', true, 'Two ways: 1+1 or 2.', 0),
(23, '3', '3', true, 'Three ways: 1+1+1, 1+2, or 2+1.', 1),
(23, '1', '1', false, null, 2),
(23, '5', '8', false, null, 3);

-- 24. Word Search II
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(24, '4 4
o a a n
e t a e
i h k r
i f l v
oath pea eat rain', 'eat oath', true, 'Words "eat" and "oath" can be found on the board.', 0),
(24, '2 2
a b
c d
abcb', '', true, 'No valid words found.', 1);

-- 25. LRU Cache
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(25, '2
put 1 1
put 2 2
get 1
put 3 3
get 2
put 4 4
get 1
get 3
get 4', '1
-1
-1
3
4', true, 'LRU evicts key 2 when inserting 3, evicts key 1 when inserting 4.', 0),
(25, '1
put 1 1
get 1
put 2 2
get 1
get 2', '1
-1
2', true, 'Capacity 1: inserting key 2 evicts key 1.', 1);
