#### Github Contribution 计数规则
Contribution Calendar简直是Github 的一个阴谋啊，它让无数的程序员沉迷在将白色方块变绿的游戏中，并且牢牢的拴住了这群人超强的好胜心，促使他们不断地向开源世界贡献代码。😄众所周知，Contribution Calendar只会显示过去一年的活动情况，每一小格子表示一天，颜色的深浅反映Contribution的数量多少。而Github Calendar只会对下列三种行为计数。
- 新建Issues
- Pull Request
- Commit

Github的这一发明助推了开源世界的繁荣发展。下面详细介绍一下Calendar的计数规则，以便我们对自己的Contribution有更准确的了解。
#### 新建Issues
当给Repo新建Issue时，如果这个Repo是自己从头建的，即不是从别人那儿fork过来的，那么会进行计数。也就是说，下面两种情况**不会计数**：

- 在别人的Repo那儿建Issue
- 建Issue的Repo是fork过来的

#### Pull Request
当给别人的Repo提Pull Request时候会计数。
#### Commit
提交是最常发生也是我们最熟悉的行为。但是下面的情况是**不会计数**的：

- 提交跟在Github上注册时用的email不一致，或者
- 提交缺少email信息
- 提交没有发生在默认的主枝上（默认master 或 gh-pages）
- 向fork过来的Repo提交，这并不会计数，除非你Pull Request以后，才会计数

#### 参考链接

[Learn how we count contributions.](https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile/)
