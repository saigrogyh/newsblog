package newsproject.backend.service;

import newsproject.backend.entity.Post;
import newsproject.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class PostService {

    @Autowired private PostRepository postRepository;
    private final String UPLOAD_DIR = "images/";

    @Value("${app.base-url}")
    private String baseUrl;

    private String saveImage(MultipartFile image) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, image.getBytes());

        return baseUrl + "/images/" + fileName;
    }

    public Post createPost(String title, String content, MultipartFile image) throws IOException {
        String imagePath = null;
        if (image != null && !image.isEmpty()) {
            imagePath = saveImage(image);
        }
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setImagePath(imagePath);
        return postRepository.save(post);
    }

    public Post updatePost(Long id, String title, String content, MultipartFile image) throws IOException {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setTitle(title);
        post.setContent(content);

        if (image != null && !image.isEmpty()) {
            String newImagePath = saveImage(image);
            post.setImagePath(newImagePath);
        }

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}