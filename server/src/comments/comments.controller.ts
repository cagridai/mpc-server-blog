import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CreateCommentDto,
  UpdateCommentDto,
  FindCommentsDto,
  ReplyToCommentDto,
} from './dto/comment.dto';
import { JwtGuard } from '../auth/guards/jwt.guards';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(userId, createCommentDto);
  }

  @UseGuards(JwtGuard)
  @Post('reply')
  reply(
    @GetUser('id') userId: string,
    @Body() replyToCommentDto: ReplyToCommentDto,
  ) {
    return this.commentsService.reply(userId, replyToCommentDto);
  }

  @Get()
  findAll(@Query() query: FindCommentsDto) {
    return this.commentsService.findAll(query);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string, @Query() query: FindCommentsDto) {
    return this.commentsService.findByPost(postId, query);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @Query() query: FindCommentsDto) {
    return this.commentsService.findByUser(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Get(':id/replies')
  findReplies(@Param('id') id: string, @Query() query: FindCommentsDto) {
    return this.commentsService.findReplies(id, query);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, userId, updateCommentDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.commentsService.remove(id, userId);
  }
}
